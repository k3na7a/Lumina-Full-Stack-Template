export type WarningSeverity = 'info' | 'warning' | 'critical'

export interface IWarning {
  message: string
  severity: WarningSeverity
}

export interface IBullHealth {
  status: 'up' | 'down'
  activeJobs?: number
  waitingJobs?: number
  delayedJobs?: number
  pausedJobs?: number
  failedJobs?: number
  completedJobs?: number
  warnings?: IWarning[]
  reason?: string
}

export interface IDatabaseConnections {
  used: number
  free: number
  queue: number
  limit: number
  percentUsed: number
}

export interface IDatabaseMetrics {
  uptimeSec?: number
  sessions?: number
  commits?: number
  rollbacks?: number
  slowQueries?: number
}

export interface IDatabaseHealth {
  status: 'up' | 'down'
  type?: string
  host?: string
  port?: number
  database?: string
  ping?: number
  connections?: Partial<IDatabaseConnections>
  metrics?: IDatabaseMetrics
  warnings?: IWarning[]
  reason?: string
}

export interface ISystemHealth {
  status: 'up' | 'down'
  host?: {
    hostname: string
    os: { platform: string; kernel: string; arch: string }
    container: { inContainer: boolean; cgroupVersion: 'v1' | 'v2' | null; runtimeHint: string | null }
  }
  runtime?: { node: string; v8: string; appVersion: string | null; gitSha: string | null }
  cpu?: { model: string; logicalCores: number; quotaCores: number | null; limited: boolean; loadAvg: (number | null)[] }
  memory?: {
    hostTotalMb: string | null
    cgroupLimitMb: string | null
    cgroupUsedMb: string | null
    cgroupUsedPct: number | null
    swapTotalMb: number | null
    swapUsedMb: number | null
  }
  disk?: { diskPath: string; freeMb: number; sizeMb: number; usedMb: number } | null
  limits?: { nofile: { soft: number | null; hard: number | null }; openFds: number | null }
  network?: { primaryIp: string | null; ifaces: { name: string; ipv4: string[]; ipv6: string[] }[] }
  uptime?: { processSec: number; systemSec: number }
  warnings?: IWarning[]
  reason?: string
}

export interface IRedisHealth {
  status: 'up' | 'down'
  collectedAt?: string
  ping?: number
  host?: string
  port?: number
  server?: { version: string | null; mode: string | null; os: string | null; uptimeSec: number }
  clients?: { connected: number; blocked: number }
  memory?: {
    usedMb: number
    peakMb: number
    fragmentationRatio: number
    maxMemoryMb: number | null
    usedPctOfMax: number | null
    maxmemoryPolicy: string | null
  }
  stats?: { hits: number; misses: number; hitRate: number | null; evictedKeys: number; expiredKeys: number }
  keyspace?: { db: number; keys: number; expires: number; avg_ttl: number; subexpiry?: number }[]
  persistence?: {
    rdbLastSaveISO: string | null
    rdbLastSaveTime: number
    rdbLastBgsaveStatus: string | null
    aofEnabled: boolean
    aofLastRewriteStatus: string | null
  }
  replication?: { role: string | null; connectedReplicas: number; masterLinkStatus: string | null }
  diagnostics?: { slowlogLen: number; latencyLatest: Array<[string, number, number]> }
  warnings?: IWarning[]
  reason?: string
}

export interface IServicesHealth {
  system: ISystemHealth
  redis: IRedisHealth
  typeorm: IDatabaseHealth
}

export interface IQueuesHealth {
  logger: IBullHealth
  logger_dlq: IBullHealth
  email: IBullHealth
  email_dlq: IBullHealth
}

export interface IHealthResponse {
  status: string
  services: IServicesHealth
  queues: IQueuesHealth
  timestamp: number
}

// -------- DTOs --------
export interface HealthBase {
  status: 'up' | 'down'
  reason?: string
}

export function resolveHealth<TUpDto extends HealthBase>(
  payload: TUpDto,
  UpDtoClass: new (payload: TUpDto) => TUpDto
): HealthUnion<TUpDto> {
  if (payload.status === 'down') return new DownDto(payload.reason ?? 'Unknown') as HealthUnion<TUpDto>
  return new UpDtoClass(payload) as HealthUnion<TUpDto>
}

export class WarningDto implements IWarning {
  public readonly message: string
  public readonly severity: 'info' | 'warning' | 'critical'

  constructor(payload: IWarning) {
    this.message = payload.message
    this.severity = payload.severity
  }
}

export class SystemHealthDto implements ISystemHealth {
  public readonly status: 'up' | 'down'
  public readonly host?: ISystemHealth['host']
  public readonly runtime?: ISystemHealth['runtime']
  public readonly cpu?: ISystemHealth['cpu']
  public readonly memory?: ISystemHealth['memory']
  public readonly disk?: ISystemHealth['disk']
  public readonly limits?: ISystemHealth['limits']
  public readonly network?: ISystemHealth['network']
  public readonly uptime?: ISystemHealth['uptime']
  public readonly warnings?: WarningDto[]
  public readonly reason?: string

  constructor(payload: ISystemHealth) {
    this.status = payload.status
    this.host = payload.host
    this.runtime = payload.runtime
    this.cpu = payload.cpu
    this.memory = payload.memory
    this.disk = payload.disk
    this.limits = payload.limits
    this.network = payload.network
    this.uptime = payload.uptime
    this.reason = payload.reason
    this.warnings = payload.warnings?.map((w) => new WarningDto(w))
  }
}

export class RedisHealthUpDto implements IRedisHealth {
  public readonly status: 'up' | 'down'
  public readonly collectedAt?: string
  public readonly ping?: number
  public readonly host?: string
  public readonly port?: number
  public readonly server?: IRedisHealth['server']
  public readonly clients?: IRedisHealth['clients']
  public readonly memory?: IRedisHealth['memory']
  public readonly stats?: IRedisHealth['stats']
  public readonly keyspace?: IRedisHealth['keyspace']
  public readonly persistence?: IRedisHealth['persistence']
  public readonly replication?: IRedisHealth['replication']
  public readonly diagnostics?: IRedisHealth['diagnostics']
  public readonly warnings?: WarningDto[]
  public readonly reason?: string

  constructor(payload: IRedisHealth) {
    this.status = payload.status
    this.collectedAt = payload.collectedAt
    this.ping = payload.ping
    this.host = payload.host
    this.port = payload.port
    this.server = payload.server
    this.clients = payload.clients
    this.memory = payload.memory
    this.stats = payload.stats
    this.keyspace = payload.keyspace
    this.persistence = payload.persistence
    this.replication = payload.replication
    this.diagnostics = payload.diagnostics
    this.reason = payload.reason
    this.warnings = payload.warnings?.map((w) => new WarningDto(w))
  }
}

export class DatabaseHealthUpDto implements IDatabaseHealth {
  public readonly status: 'up' | 'down'
  public readonly type?: string
  public readonly host?: string
  public readonly port?: number
  public readonly database?: string
  public readonly ping?: number
  public readonly connections?: IDatabaseHealth['connections']
  public readonly metrics?: IDatabaseHealth['metrics']
  public readonly warnings?: WarningDto[]
  public readonly reason?: string

  constructor(payload: IDatabaseHealth) {
    this.status = payload.status
    this.type = payload.type
    this.host = payload.host
    this.port = payload.port
    this.database = payload.database
    this.ping = payload.ping
    this.connections = payload.connections
    this.metrics = payload.metrics
    this.reason = payload.reason
    this.warnings = payload.warnings?.map((w) => new WarningDto(w))
  }
}

export class BullHealthDto implements IBullHealth {
  public readonly status: 'up' | 'down'
  public readonly activeJobs?: number
  public readonly waitingJobs?: number
  public readonly delayedJobs?: number
  public readonly pausedJobs?: number
  public readonly failedJobs?: number
  public readonly completedJobs?: number
  public readonly warnings?: WarningDto[]
  public readonly reason?: string

  constructor(payload: IBullHealth) {
    this.status = payload.status
    this.activeJobs = payload.activeJobs
    this.waitingJobs = payload.waitingJobs
    this.delayedJobs = payload.delayedJobs
    this.pausedJobs = payload.pausedJobs
    this.failedJobs = payload.failedJobs
    this.completedJobs = payload.completedJobs
    this.reason = payload.reason
    this.warnings = payload.warnings?.map((w) => new WarningDto(w))
  }
}

export class ServicesHealthDto implements IServicesHealth {
  public readonly system: HealthUnion<SystemHealthDto>
  public readonly redis: HealthUnion<RedisHealthUpDto>
  public readonly typeorm: HealthUnion<DatabaseHealthUpDto>

  constructor(payload: IServicesHealth) {
    this.system = resolveHealth(payload.system, SystemHealthDto)
    this.redis = resolveHealth(payload.redis, RedisHealthUpDto)
    this.typeorm = resolveHealth(payload.typeorm, DatabaseHealthUpDto)
  }
}

export class QueueHealthDto implements IQueuesHealth {
  public readonly logger: HealthUnion<BullHealthDto>
  public readonly logger_dlq: HealthUnion<BullHealthDto>
  public readonly email: HealthUnion<BullHealthDto>
  public readonly email_dlq: HealthUnion<BullHealthDto>

  constructor(payload: IQueuesHealth) {
    this.logger = resolveHealth(payload.logger, BullHealthDto)
    this.logger_dlq = resolveHealth(payload.logger_dlq, BullHealthDto)
    this.email = resolveHealth(payload.email, BullHealthDto)
    this.email_dlq = resolveHealth(payload.email_dlq, BullHealthDto)
  }
}

export class HealthResponseDto implements IHealthResponse {
  public readonly status: string
  public readonly services: ServicesHealthDto
  public readonly queues: QueueHealthDto
  public readonly timestamp: number

  constructor(payload: IHealthResponse) {
    this.status = payload.status
    this.services = new ServicesHealthDto(payload.services)
    this.queues = new QueueHealthDto(payload.queues)
    this.timestamp = payload.timestamp ?? Date.now()
  }
}

export class DownDto {
  public readonly status: 'down' = 'down'
  public readonly reason: string

  constructor(reason: string) {
    this.reason = reason
  }
}

export type HealthUnion<T> = T | DownDto
export type RedisHealthDto = HealthUnion<RedisHealthUpDto>
