// ---------- Redis Health ----------

import { ApiProperty } from '@nestjs/swagger';
import { DownDto, Warning, WarningDto } from './health.dto';
import { HealthIndicatorResult } from '@nestjs/terminus';

export class RedisServerDto {
  @ApiProperty({ example: '8.2.1' })
  public readonly version: string | null;
  @ApiProperty({ example: 'standalone' })
  public readonly mode: string | null;
  @ApiProperty({ example: 'Linux 6.6.87.2-microsoft-standard-WSL2 x86_64' })
  public readonly os: string | null;
  @ApiProperty({ example: 100700 })
  public readonly uptimeSec: number;
}

export class RedisClientsDto {
  @ApiProperty({ example: 19 })
  public readonly connected: number;
  @ApiProperty({ example: 6 })
  public readonly blocked: number;
}

export class RedisMemoryDto {
  @ApiProperty({ example: 2.08 })
  public readonly usedMb: number;
  @ApiProperty({ example: 2.3 })
  public readonly peakMb: number;
  @ApiProperty({ example: 6.23 })
  public readonly fragmentationRatio: number;
  @ApiProperty({ example: null, nullable: true })
  public readonly maxMemoryMb: number | null;
  @ApiProperty({ example: null, nullable: true })
  public readonly usedPctOfMax: number | null;
  @ApiProperty({ example: 'noeviction' })
  public readonly maxmemoryPolicy: string | null;
}

export class RedisStatsDto {
  @ApiProperty({ example: 126387 }) hits: number;
  @ApiProperty({ example: 298145 }) misses: number;
  @ApiProperty({ example: 0.29, nullable: true }) hitRate: number | null;
  @ApiProperty({ example: 0 }) evictedKeys: number;
  @ApiProperty({ example: 13036 }) expiredKeys: number;
}

export class KeyspaceEntryDto {
  @ApiProperty({ example: 0 }) db: number;
  @ApiProperty({ example: 15 }) keys: number;
  @ApiProperty({ example: 4 }) expires: number;
  @ApiProperty({ example: 27997 }) avg_ttl: number;
  @ApiProperty({ example: 0, nullable: true }) subexpiry?: number;
}

export class RedisPersistenceDto {
  @ApiProperty({ example: '2025-10-02T20:45:42.355Z', nullable: true })
  rdbLastSaveISO: string | null;
  @ApiProperty({ example: 1759437800 }) rdbLastSaveTime: number;
  @ApiProperty({ example: 'ok', nullable: true }) rdbLastBgsaveStatus:
    | string
    | null;
  @ApiProperty({ example: false }) aofEnabled: boolean;
  @ApiProperty({ example: 'ok', nullable: true }) aofLastRewriteStatus:
    | string
    | null;
}

export class RedisReplicationDto {
  @ApiProperty({ example: 'master', nullable: true }) role: string | null;
  @ApiProperty({ example: 0 }) connectedReplicas: number;
  @ApiProperty({ example: null, nullable: true }) masterLinkStatus:
    | string
    | null;
}

export class RedisDiagnosticsDto {
  @ApiProperty({ example: 0 }) slowlogLen: number;
  @ApiProperty({ example: [] }) latencyLatest: Array<[string, number, number]>;
}

export class RedisHealthUpDto {
  @ApiProperty({ example: 'up' }) status: 'up';
  @ApiProperty({ example: '2025-10-02T20:45:42.355Z' }) collectedAt: string;
  @ApiProperty({ example: 1 }) ping: number;
  @ApiProperty({ example: '127.0.0.1' }) host: string;
  @ApiProperty({ example: 6379 }) port: number;
  @ApiProperty({ type: () => RedisServerDto }) server: RedisServerDto;
  @ApiProperty({ type: () => RedisClientsDto }) clients: RedisClientsDto;
  @ApiProperty({ type: () => RedisMemoryDto }) memory: RedisMemoryDto;
  @ApiProperty({ type: () => RedisStatsDto }) stats: RedisStatsDto;
  @ApiProperty({ type: [KeyspaceEntryDto] }) keyspace: KeyspaceEntryDto[];
  @ApiProperty({ type: () => RedisPersistenceDto })
  persistence: RedisPersistenceDto;
  @ApiProperty({ type: () => RedisReplicationDto })
  replication: RedisReplicationDto;
  @ApiProperty({ type: () => RedisDiagnosticsDto })
  diagnostics: RedisDiagnosticsDto;
  @ApiProperty({ type: [WarningDto] }) warnings: WarningDto[];
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

export interface KeyspaceEntry {
  db: number;
  keys: number;
  expires: number;
  avg_ttl: number;
  subexpiry?: number;
  [extra: string]: number | string | undefined;
}

export type RedisHealthResult =
  | HealthIndicatorResult<'redis', 'up', iredisoverview>
  | HealthIndicatorResult<'redis', 'down', { reason: string }>;

export type RedisServiceHealth =
  | ({ status: 'up' } & iredisoverview)
  | { status: 'down'; reason: string };

export type RedisHealthDto = RedisHealthUpDto | DownDto;
