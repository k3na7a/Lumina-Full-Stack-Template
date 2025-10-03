import { ApiProperty } from '@nestjs/swagger';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { DataSourceOptions } from 'typeorm';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok' })
  public readonly status: string;

  @ApiProperty()
  public readonly services: ServicesHealth;

  @ApiProperty({ example: 1725116400000 })
  public readonly timestamp: number;

  constructor(raw: { status: string; details: ServicesHealth }) {
    this.status = raw.status;
    this.services = raw.details;
    this.timestamp = new Date().getTime();
  }
}

export type SystemHealthResult = HealthIndicatorResult<
  'system',
  'up',
  isystemhealth
>;

export type RedisHealthResult =
  | HealthIndicatorResult<'redis', 'up', iredisoverview>
  | HealthIndicatorResult<'redis', 'down', { reason: string }>;

export type DbHealthResult =
  | HealthIndicatorResult<'typeorm', 'up', ITypeOrmHealth>
  | HealthIndicatorResult<'typeorm', 'down', { reason: string }>;

export type AllHealthResults =
  | SystemHealthResult
  | RedisHealthResult
  | DbHealthResult;

export type RedisServiceHealth =
  | ({ status: 'up' } & iredisoverview)
  | { status: 'down'; reason: string };

export type SystemServiceHealth =
  | ({ status: 'up' } & isystemhealth)
  | { status: 'down'; reason: string };

export type TypeOrmServiceHealth =
  | ({ status: 'up' } & ITypeOrmHealth)
  | { status: 'down'; reason: string };

export interface ServicesHealth {
  redis: RedisServiceHealth;
  system: SystemServiceHealth;
  typeorm: TypeOrmServiceHealth;
}

export interface isystemhealth {
  host: {
    hostname: string;
    os: {
      platform: string;
      kernel: string;
      arch: string;
    };
    container: {
      inContainer: boolean;
      cgroupVersion: 'v2' | 'v1' | null;
      runtimeHint: string | null;
    };
  };
  runtime: {
    node: string;
    v8: string;
    appVersion: string | null;
    gitSha: string | null;
  };
  cpu: {
    model: string;
    logicalCores: number;
    quotaCores: number | null;
    limited: boolean;
    loadAvg: null[] | number[];
  };
  memory: {
    hostTotalMb: string | null;
    cgroupLimitMb: string | null;
    cgroupUsedMb: string | null;
    cgroupUsedPct: number | null;
    swapTotalMb: number | null;
    swapUsedMb: number | null;
  };
  disk: {
    diskPath: string;
    freeMb: number;
    sizeMb: number;
    usedMb: number;
  } | null;
  limits: {
    nofile: {
      soft: number | null;
      hard: number | null;
    };
    openFds: number | null;
  };
  network: {
    primaryIp: string | null;
    ifaces: {
      name: string;
      ipv4: string[];
      ipv6: string[];
    }[];
  };
  uptime: {
    processSec: number;
    systemSec: number;
  };
  warnings: Warning[];
}

export interface KeyspaceEntry {
  db: number;
  keys: number;
  expires: number;
  avg_ttl: number;
  subexpiry?: number;
  [extra: string]: number | string | undefined;
}

export type WarningSeverity = 'info' | 'warning' | 'critical';

export interface Warning {
  message: string;
  severity: WarningSeverity;
}

export interface iredisoverview {
  collectedAt: string;

  ping: number;
  host: string;
  port: number;

  server: {
    version: string | null;
    mode: string | null;
    os: string | null;
    uptimeSec: number;
  };

  clients: {
    connected: number;
    blocked: number;
  };

  memory: {
    usedMb: number;
    peakMb: number;
    fragmentationRatio: number;
    maxMemoryMb: number | null;
    usedPctOfMax: number | null;
    maxmemoryPolicy: string | null;
  };

  stats: {
    hits: number;
    misses: number;
    hitRate: number | null;
    evictedKeys: number;
    expiredKeys: number;
  };

  keyspace: Array<KeyspaceEntry>;

  persistence: {
    rdbLastSaveISO: string | null;
    rdbLastSaveTime: number;
    rdbLastBgsaveStatus: string | null;
    aofEnabled: boolean;
    aofLastRewriteStatus: string | null;
  };

  replication: {
    role: string | null;
    connectedReplicas: number;
    masterLinkStatus: string | null;
  };

  diagnostics: {
    slowlogLen: number;
    latencyLatest: Array<[string, number, number]>;
  };

  warnings: Warning[];
}

export interface IDatabaseConnections {
  used: number;
  free: number;
  queue: number;
  limit: number;
  percentUsed: number;
}

export interface IDatabaseMetrics {
  uptimeSec?: number;
  sessions?: number;
  commits?: number;
  rollbacks?: number;
  slowQueries?: number;
}

export interface ITypeOrmHealth {
  type: DataSourceOptions['type'];
  host?: string;
  port?: number;
  database?: string;
  ping: number;
  connections: Partial<IDatabaseConnections>;
  metrics: IDatabaseMetrics;
  warnings: Warning[];
}
