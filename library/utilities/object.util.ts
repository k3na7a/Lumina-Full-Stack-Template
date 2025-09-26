import { IncomingHttpHeaders } from 'node:http2'

const deepEqual = (x: any, y: any): boolean => {
  const ok = Object.keys,
    tx = typeof x,
    ty = typeof y
  return x && y && tx === 'object' && tx === ty
    ? ok(x).length === ok(y).length && ok(x).every((key) => deepEqual(x[key], y[key]))
    : x === y
}

const checkIds = (x: any, y: any): boolean => {
  const ctx = typeof x
  const ty = typeof y

  return ctx === ty && x['id'] == y['id']
}

function escapeHtml(s: string) {
  return s.trim().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

type Opts = { indentSize?: number }
const isPlain = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v) && Object.getPrototypeOf(v) === Object.prototype

function primaryKeyOf(o: Record<string, unknown>): string | null {
  for (const k of ['id', 'name', 'label', 'slug']) if (k in o) return k
  return null
}

export function prettyDiffToHtml(value: unknown, opts: Opts = {}, level = 0): string {
  const pad = '&nbsp;'.repeat((opts.indentSize ?? 2) * level)

  if (Array.isArray(value)) {
    if (value.length === 0) return `${pad}<span class="pd-bracket">[ ]</span>`
    const open = `${pad}<span class="pd-bracket">[</span>\n`
    const items = value.map((v, i) => renderArrayItem(v, opts, level + 1, i)).join('\n')
    const close = `\n${pad}<span class="pd-bracket">]</span>`
    return open + items + close
  }

  if (isPlain(value)) {
    const entries = Object.entries(value)
    if (entries.length === 0) return `${pad}<span class="pd-empty">(empty)</span>`
    return entries
      .map(([k, v]) => {
        const keyHtml = `<span class="pd-key">${escapeHtml(k)}</span><span class="pd-colon">:</span>`
        if (isPlain(v) || Array.isArray(v)) {
          const child = prettyDiffToHtml(v, opts, level + 1)
          return `${pad}${keyHtml}\n${child}`
        } else {
          return `${pad}${keyHtml} <span class="pd-value">${formatPrimitive(v)}</span>`
        }
      })
      .join('\n')
  }

  return `${pad}<span class="pd-value">${formatPrimitive(value)}</span>`
}

function renderArrayItem(v: unknown, opts: Opts, level: number, _index: number): string {
  const pad = '&nbsp;'.repeat((opts.indentSize ?? 2) * level)

  const bullet = `<span class="pd-bullet">-</span>`

  if (Array.isArray(v)) {
    const child = prettyDiffToHtml(v, opts, level + 1)
    return `${pad}${bullet}\n${child}`
  }

  if (isPlain(v)) {
    const obj = v as Record<string, unknown>
    const pk = primaryKeyOf(obj)

    if (pk) {
      const header =
        `${pad}${bullet} <span class="pd-key">${escapeHtml(pk)}</span><span class="pd-colon">:</span> ` +
        `<span class="pd-value">${formatPrimitive(obj[pk])}</span>`

      const rest: Record<string, unknown> = {}
      for (const [k, val] of Object.entries(obj)) if (k !== pk) rest[k] = val

      const body = Object.keys(rest).length ? '\n' + prettyDiffToHtml(rest, opts, level + 1) : ''

      return header + body
    }

    const child = prettyDiffToHtml(obj, opts, level + 1)
    return `${pad}${bullet}\n${child}`
  }

  return `${pad}${bullet} <span class="pd-value">${formatPrimitive(v)}</span>`
}

function formatPrimitive(v: unknown): string {
  if (v === null) return `<span class="pd-null">null</span>`
  switch (typeof v) {
    case 'string':
      return `<span class="pd-string">${escapeHtml(v)}</span>`
    case 'number':
      return `<span class="pd-number">${String(v)}</span>`
    case 'boolean':
      return `<span class="pd-boolean">${String(v)}</span>`
    default:
      return `<span class="pd-string">${escapeHtml(String(v))}</span>`
  }
}

export function toSafeJson<T>(obj: T): Record<string, unknown> {
  return JSON.parse(JSON.stringify(obj))
}

export type LeafChange = { before: unknown; after: unknown }
export type NestedDiff = {
  added?: Record<string, unknown>
  removed?: Record<string, unknown>
  updated?: Record<string, NestedDiff | LeafChange>
}

function matches(path: string[], key: string, set: Set<string>) {
  if (set.has(key)) return true
  const full = [...path, key].join('.')
  return set.has(full)
}

function toIdArray(val: unknown, idField: string): unknown {
  if (!Array.isArray(val)) return val
  return val.map((x) => (isPlain(x) && idField in x ? (x as any)[idField] : x))
}

function redactValue(
  value: unknown,
  path: string[],
  key: string,
  sensitive: Set<string>,
  entityArrays: Set<string>,
  mask: string,
  idField: string
): unknown {
  const entityArrayHere = matches(path, key, entityArrays)
  const normalized = entityArrayHere ? toIdArray(value, idField) : value

  if (matches(path, key, sensitive)) return mask

  if (Array.isArray(normalized)) {
    return normalized.map((v) =>
      isPlain(v)
        ? redactObject(v as Record<string, unknown>, [...path, key], sensitive, entityArrays, mask, idField)
        : v
    )
  }
  if (isPlain(normalized)) {
    return redactObject(normalized as Record<string, unknown>, [...path, key], sensitive, entityArrays, mask, idField)
  }
  return normalized
}

export function redactObject(
  obj: Record<string, unknown>,
  path: string[],
  sensitive: Set<string>,
  entityArrays: Set<string>,
  mask: string = '[REDACTED]',
  idField: string = 'id'
): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(obj)) {
    out[key] = redactValue(val, path, key, sensitive, entityArrays, mask, idField)
  }
  return out
}

export function computeDiffWithRedaction(
  before: Record<string, unknown> = {},
  after: Record<string, unknown> = {},
  sensitiveKeys: string[] = [],
  entityArrayKeys: string[] = [],
  mask = '[REDACTED]',
  idField = 'id',
  _path: string[] = []
): NestedDiff {
  const S = new Set(sensitiveKeys)
  const E = new Set(entityArrayKeys)

  const added: Record<string, unknown> = {}
  const removed: Record<string, unknown> = {}
  const updated: Record<string, NestedDiff | LeafChange> = {}

  const keys = new Set([...Object.keys(before), ...Object.keys(after)])
  for (const key of keys) {
    const redact = matches(_path, key, S)
    const asIds = matches(_path, key, E)

    const rawB = (before as any)[key]
    const rawA = (after as any)[key]

    const b = asIds ? toIdArray(rawB, idField) : rawB
    const a = asIds ? toIdArray(rawA, idField) : rawA

    if (!(key in before)) {
      added[key] = redact ? mask : a
      continue
    }
    if (!(key in after)) {
      removed[key] = redact ? mask : b
      continue
    }

    if (isPlain(b) && isPlain(a)) {
      const child = computeDiffWithRedaction(
        b as Record<string, unknown>,
        a as Record<string, unknown>,
        sensitiveKeys,
        entityArrayKeys,
        mask,
        idField,
        [..._path, key]
      )
      if (child.added || child.removed || child.updated) {
        const node: Record<string, NestedDiff | LeafChange> & {
          added?: Record<string, unknown>
          removed?: Record<string, unknown>
        } = {}
        if (child.added) node.added = child.added
        if (child.removed) node.removed = child.removed
        if (child.updated) for (const k of Object.keys(child.updated)) node[k] = child.updated[k]!
        updated[key] = node
      }
    } else {
      const changed = JSON.stringify(b) !== JSON.stringify(a)
      if (changed) {
        updated[key] = redact ? { before: mask, after: mask } : { before: b, after: a }
      }
    }
  }

  const out: NestedDiff = {}
  if (Object.keys(added).length) out.added = added
  if (Object.keys(removed).length) out.removed = removed
  if (Object.keys(updated).length) out.updated = updated
  return out
}

export function buildAuditSnapshotsAndDiff(
  before: Record<string, unknown> = {},
  after: Record<string, unknown> = {},
  sensitiveKeys: string[] = [],
  entityArrayKeys: string[] = [],
  mask = '[REDACTED]',
  idField = 'id'
) {
  const S = new Set(sensitiveKeys)
  const E = new Set(entityArrayKeys)
  const beforeRedacted = redactObject(before, [], S, E, mask, idField)
  const afterRedacted = redactObject(after, [], S, E, mask, idField)
  const diff = computeDiffWithRedaction(before, after, sensitiveKeys, entityArrayKeys, mask, idField)
  return { beforeRedacted, afterRedacted, diff }
}

const SENSITIVE_HEADERS = ['authorization', 'cookie', 'set-cookie', 'X-CSRF-Token']

export function redactHeaders(
  headers: Headers | IncomingHttpHeaders,
  mask = '[REDACTED]',
  sensitiveKeys: string[] = SENSITIVE_HEADERS
): Record<string, unknown> {
  const set = new Set(sensitiveKeys.map((h) => h.toLowerCase()))
  const out: Record<string, unknown> = {}

  for (const [k, v] of Object.entries(headers)) {
    const key = k.toLowerCase()
    if (set.has(key)) {
      out[key] = mask
    } else {
      out[key] = v
    }
  }
  return out
}

export { deepEqual, checkIds }
