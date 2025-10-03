export type WarningSeverity = 'info' | 'warning' | 'critical'

export interface Warning {
  message: string
  severity: WarningSeverity
}

export interface IBullQueueMetrics {
  active: number
  waiting: number
  failed: number
  delayed: number
  paused: number
  completed: number
  isPaused: boolean
}

export interface IBullHealth {
  activeJobs: number
  waitingJobs: number
  delayedJobs: number
  pausedJobs: number
  failedJobs: number
  completedJobs: number
  warnings: Warning[]
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

export interface ITypeOrmHealth {
  type: string
  host?: string
  port?: number
  database?: string
  ping: number
  connections: Partial<IDatabaseConnections>
  metrics: IDatabaseMetrics
  warnings: Warning[]
}

export interface iredisoverview {
  collectedAt: string

  ping: number
  host: string
  port: number

  server: {
    version: string | null
    mode: string | null
    os: string | null
    uptimeSec: number
  }

  clients: {
    connected: number
    blocked: number
  }

  memory: {
    usedMb: number
    peakMb: number
    fragmentationRatio: number
    maxMemoryMb: number | null
    usedPctOfMax: number | null
    maxmemoryPolicy: string | null
  }

  stats: {
    hits: number
    misses: number
    hitRate: number | null
    evictedKeys: number
    expiredKeys: number
  }

  keyspace: Array<KeyspaceEntry>

  persistence: {
    rdbLastSaveISO: string | null
    rdbLastSaveTime: number
    rdbLastBgsaveStatus: string | null
    aofEnabled: boolean
    aofLastRewriteStatus: string | null
  }

  replication: {
    role: string | null
    connectedReplicas: number
    masterLinkStatus: string | null
  }

  diagnostics: {
    slowlogLen: number
    latencyLatest: Array<[string, number, number]>
  }

  warnings: Warning[]
}

export interface KeyspaceEntry {
  db: number
  keys: number
  expires: number
  avg_ttl: number
  subexpiry?: number
  [extra: string]: number | string | undefined
}
