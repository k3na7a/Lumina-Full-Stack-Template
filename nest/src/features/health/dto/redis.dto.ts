import { ApiProperty } from '@nestjs/swagger';
import { WarningDto } from './health.dto';
import { HealthIndicatorResult } from '@nestjs/terminus';

export class RedisServerDto {
  @ApiProperty({ example: '8.2.1', description: 'Redis server version' })
  public readonly version: string | null;

  @ApiProperty({ example: 'standalone', description: 'Redis operating mode' })
  public readonly mode: string | null;

  @ApiProperty({
    example: 'Linux 6.6.87.2-microsoft-standard-WSL2 x86_64',
    description: 'Operating system string reported by Redis',
  })
  public readonly os: string | null;

  @ApiProperty({ example: 100700, description: 'Server uptime in seconds' })
  public readonly uptimeSec: number;

  constructor(payload: RedisServerDto) {
    this.version = payload.version;
    this.mode = payload.mode;
    this.os = payload.os;
    this.uptimeSec = payload.uptimeSec;
  }
}

export class RedisClientsDto {
  @ApiProperty({
    example: 19,
    description: 'Number of connected client connections',
  })
  public readonly connected: number;

  @ApiProperty({
    example: 6,
    description:
      'Number of blocked clients (e.g. waiting on blocking commands)',
  })
  public readonly blocked: number;

  constructor(payload: RedisClientsDto) {
    this.connected = payload.connected;
    this.blocked = payload.blocked;
  }
}

export class RedisMemoryDto {
  @ApiProperty({ example: 2.08, description: 'Current memory usage in MB' })
  public readonly usedMb: number;

  @ApiProperty({ example: 2.3, description: 'Peak memory usage in MB' })
  public readonly peakMb: number;

  @ApiProperty({
    example: 6.23,
    description: 'Memory fragmentation ratio (ideal ~1.0)',
  })
  public readonly fragmentationRatio: number;

  @ApiProperty({
    example: null,
    nullable: true,
    description: 'Max configured memory in MB, null if unlimited',
  })
  public readonly maxMemoryMb: number | null;

  @ApiProperty({
    example: null,
    nullable: true,
    description: 'Percentage of max memory used, null if unlimited',
  })
  public readonly usedPctOfMax: number | null;

  @ApiProperty({
    example: 'noeviction',
    description: 'Maxmemory eviction policy',
  })
  public readonly maxmemoryPolicy: string | null;

  constructor(payload: RedisMemoryDto) {
    this.usedMb = payload.usedMb;
    this.peakMb = payload.peakMb;
    this.fragmentationRatio = payload.fragmentationRatio;
    this.maxMemoryMb = payload.maxMemoryMb;
    this.usedPctOfMax = payload.usedPctOfMax;
    this.maxmemoryPolicy = payload.maxmemoryPolicy;
  }
}

export class RedisStatsDto {
  @ApiProperty({ example: 126387, description: 'Number of keyspace hits' })
  public readonly hits: number;

  @ApiProperty({ example: 298145, description: 'Number of keyspace misses' })
  public readonly misses: number;

  @ApiProperty({
    example: 0.29,
    nullable: true,
    description: 'Cache hit rate ratio',
  })
  public readonly hitRate: number | null;

  @ApiProperty({ example: 0, description: 'Number of evicted keys' })
  public readonly evictedKeys: number;

  @ApiProperty({ example: 13036, description: 'Number of expired keys' })
  public readonly expiredKeys: number;

  constructor(payload: RedisStatsDto) {
    this.hits = payload.hits;
    this.misses = payload.misses;
    this.hitRate = payload.hitRate;
    this.evictedKeys = payload.evictedKeys;
    this.expiredKeys = payload.expiredKeys;
  }
}

export class KeyspaceEntryDto {
  @ApiProperty({ example: 0, description: 'Database index (db number)' })
  public readonly db: number;

  @ApiProperty({ example: 15, description: 'Number of keys in this database' })
  public readonly keys: number;

  @ApiProperty({
    example: 4,
    description: 'Number of keys with an expiration (TTL)',
  })
  public readonly expires: number;

  @ApiProperty({
    example: 27997,
    description: 'Average TTL of keys in milliseconds',
  })
  public readonly avg_ttl: number;

  @ApiProperty({
    example: 0,
    nullable: true,
    description: 'Subexpiry metrics (if available)',
  })
  public readonly subexpiry?: number;

  constructor(payload: KeyspaceEntryDto) {
    this.db = payload.db;
    this.keys = payload.keys;
    this.expires = payload.expires;
    this.avg_ttl = payload.avg_ttl;
    this.subexpiry = payload.subexpiry;
  }
}

export class RedisPersistenceDto {
  @ApiProperty({
    example: '2025-10-02T20:45:42.355Z',
    nullable: true,
    description: 'Last RDB save timestamp in ISO string',
  })
  public readonly rdbLastSaveISO: string | null;

  @ApiProperty({
    example: 1759437800,
    description: 'Last RDB save timestamp (epoch seconds)',
  })
  public readonly rdbLastSaveTime: number;

  @ApiProperty({
    example: 'ok',
    nullable: true,
    description: 'Last RDB background save status',
  })
  public readonly rdbLastBgsaveStatus: string | null;

  @ApiProperty({ example: false, description: 'Whether AOF is enabled' })
  public readonly aofEnabled: boolean;

  @ApiProperty({
    example: 'ok',
    nullable: true,
    description: 'Last AOF rewrite status',
  })
  public readonly aofLastRewriteStatus: string | null;

  constructor(payload: RedisPersistenceDto) {
    this.rdbLastSaveISO = payload.rdbLastSaveISO;
    this.rdbLastSaveTime = payload.rdbLastSaveTime;
    this.rdbLastBgsaveStatus = payload.rdbLastBgsaveStatus;
    this.aofEnabled = payload.aofEnabled;
    this.aofLastRewriteStatus = payload.aofLastRewriteStatus;
  }
}

export class RedisReplicationDto {
  @ApiProperty({
    example: 'master',
    nullable: true,
    description: 'Replication role (master/replica)',
  })
  public readonly role: string | null;

  @ApiProperty({
    example: 0,
    description: 'Number of connected replicas',
  })
  public readonly connectedReplicas: number;

  @ApiProperty({
    example: null,
    nullable: true,
    description: 'Master link status if this is a replica',
  })
  public readonly masterLinkStatus: string | null;

  constructor(payload: RedisReplicationDto) {
    this.role = payload.role;
    this.connectedReplicas = payload.connectedReplicas;
    this.masterLinkStatus = payload.masterLinkStatus;
  }
}

export class RedisDiagnosticsDto {
  @ApiProperty({ example: 0, description: 'Length of the slowlog' })
  public readonly slowlogLen: number;

  @ApiProperty({
    example: [],
    description: 'Most recent latency events (if enabled)',
  })
  public readonly latencyLatest: Array<[string, number, number]>;

  constructor(payload: RedisDiagnosticsDto) {
    this.slowlogLen = payload.slowlogLen;
    this.latencyLatest = payload.latencyLatest ?? [];
  }
}

export class RedisHealthUpDto {
  @ApiProperty({ example: 'up', description: 'Overall health status' })
  public readonly status: 'up';

  @ApiProperty({
    example: '2025-10-02T20:45:42.355Z',
    description: 'Timestamp when metrics were collected',
  })
  public readonly collectedAt: string;

  @ApiProperty({
    example: 1,
    description: 'Ping latency to Redis in milliseconds',
  })
  public readonly ping: number;

  @ApiProperty({ example: '127.0.0.1', description: 'Redis host address' })
  public readonly host: string;

  @ApiProperty({ example: 6379, description: 'Redis port number' })
  public readonly port: number;

  @ApiProperty({ type: () => RedisServerDto })
  public readonly server: RedisServerDto;

  @ApiProperty({ type: () => RedisClientsDto })
  public readonly clients: RedisClientsDto;

  @ApiProperty({ type: () => RedisMemoryDto })
  public readonly memory: RedisMemoryDto;

  @ApiProperty({ type: () => RedisStatsDto })
  public readonly stats: RedisStatsDto;

  @ApiProperty({ type: [KeyspaceEntryDto] })
  public readonly keyspace: KeyspaceEntryDto[];

  @ApiProperty({ type: () => RedisPersistenceDto })
  public readonly persistence: RedisPersistenceDto;

  @ApiProperty({ type: () => RedisReplicationDto })
  public readonly replication: RedisReplicationDto;

  @ApiProperty({ type: () => RedisDiagnosticsDto })
  public readonly diagnostics: RedisDiagnosticsDto;

  @ApiProperty({ type: [WarningDto] })
  public readonly warnings: WarningDto[];

  constructor(payload: RedisHealthUpDto) {
    this.status = payload.status;
    this.collectedAt = payload.collectedAt;
    this.ping = payload.ping;
    this.host = payload.host;
    this.port = payload.port;
    this.server = new RedisServerDto(payload.server);
    this.clients = new RedisClientsDto(payload.clients);
    this.memory = new RedisMemoryDto(payload.memory);
    this.stats = new RedisStatsDto(payload.stats);
    this.keyspace = (payload.keyspace ?? []).map(
      (k) => new KeyspaceEntryDto(k),
    );
    this.persistence = new RedisPersistenceDto(payload.persistence);
    this.replication = new RedisReplicationDto(payload.replication);
    this.diagnostics = new RedisDiagnosticsDto(payload.diagnostics);
    this.warnings = (payload.warnings ?? []).map((w) => new WarningDto(w));
  }
}

export type RedisHealthResult =
  | HealthIndicatorResult<'redis', 'up', RedisHealthUpDto>
  | HealthIndicatorResult<'redis', 'down', { reason: string }>;
