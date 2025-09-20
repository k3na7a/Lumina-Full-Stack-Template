import { BaseDto, BaseInterface } from './base.dto'
import { PaginationOptions } from './pagination.dto'

export enum ActorType {
  USER = 'user',
  SYSTEM = 'system',
  SERVICE = 'service'
}

export enum SourceType {
  API = 'api',
  WEB = 'web',
  ADMIN_UI = 'admin-ui',
  WORKER = 'worker',
  CRON = 'cron',
  WEBHOOK = 'webhook'
}

export enum Action {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete'
}

export enum Domain {
  USER_MANAGEMENT = 'user_management',
  GAMES_AND_SOFTWARE = 'games_and_software'
}

export enum SUB_DOMAIN {
  USER = 'user',
  ROLE = 'role',
  PERMISSION = 'permission',
  GAME = 'game',
  PLATFORM = 'platform'
}

export class AuditPaginationOptions extends PaginationOptions {
  public readonly domain?: Domain
}

export interface AuditEvent extends BaseInterface {
  readonly actorId?: string | null
  readonly actorIp?: string | null
  readonly actorUa?: string | null
  readonly actorDisplay?: string | null

  readonly requestId?: string | null
  readonly jobId?: string | null

  readonly actorType: ActorType
  readonly source: SourceType
  readonly domain: Domain
  readonly subDomain: SUB_DOMAIN

  readonly action: Action
  readonly entityId: string
  readonly entityDisplay?: string | null

  readonly before?: Record<string, unknown> | null
  readonly after?: Record<string, unknown> | null
  readonly diff?: Record<string, unknown> | null
  readonly reason?: string | null
  readonly metadata?: Record<string, unknown> | null
}

export class AuditEventDto extends BaseDto implements AuditEvent {
  public readonly actorId?: string | null
  public readonly actorIp?: string | null
  public readonly actorUa?: string | null
  public readonly actorDisplay?: string | null

  public readonly requestId?: string | null
  public readonly jobId?: string | null

  public readonly actorType: ActorType
  public readonly source: SourceType
  public readonly domain: Domain
  public readonly subDomain: SUB_DOMAIN

  public readonly action: Action
  public readonly entityId: string
  public readonly entityDisplay?: string | null

  public readonly before?: Record<string, unknown> | null
  public readonly after?: Record<string, unknown> | null
  public readonly diff?: Record<string, unknown> | null
  public readonly reason?: string | null
  public readonly metadata?: Record<string, unknown> | null

  constructor(payload: AuditEvent) {
    super(payload)

    this.actorId = payload.actorId
    this.actorIp = payload.actorIp
    this.actorUa = payload.actorUa
    this.actorDisplay = payload.actorDisplay

    this.requestId = payload.requestId
    this.jobId = payload.jobId

    this.actorType = payload.actorType
    this.source = payload.source
    this.domain = payload.domain
    this.subDomain = payload.subDomain

    this.action = payload.action
    this.entityId = payload.entityId
    this.entityDisplay = payload.entityDisplay

    this.before = payload.before
    this.after = payload.after
    this.diff = payload.diff
    this.reason = payload.reason
    this.metadata = payload.metadata
  }
}
