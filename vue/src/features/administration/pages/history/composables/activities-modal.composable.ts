import { computed, ComputedRef, Ref, toRef } from 'vue'

import { AuditEventDto } from '@lib/dto/audit.dto'
import { prettyDiffToHtml, toSafeJson } from '@lib/utilities/object.util'

export type proptype = { title: string; event: AuditEventDto }
export type composable = {
  $details: ComputedRef<string>
  $before: ComputedRef<string>
  $after: ComputedRef<string>
  $diff: ComputedRef<string>
  $meta: ComputedRef<string>
}

export function useActivitiesModal(props: proptype): composable {
  const event: Ref<AuditEventDto> = toRef<proptype, 'event'>(props, 'event')
  const { diff, before, after, metadata, ...details } = event.value

  const $details: ComputedRef<string> = computed(() => prettyDiffToHtml(toSafeJson(details), { indentSize: 2 }))
  const $before: ComputedRef<string> = computed(() => prettyDiffToHtml(before, { indentSize: 2 }))
  const $after: ComputedRef<string> = computed(() => prettyDiffToHtml(after, { indentSize: 2 }))
  const $diff: ComputedRef<string> = computed(() => prettyDiffToHtml(diff, { indentSize: 2 }))
  const $meta: ComputedRef<string> = computed(() => prettyDiffToHtml(metadata, { indentSize: 2 }))

  return {
    $details,
    $before,
    $after,
    $diff,
    $meta
  }
}
