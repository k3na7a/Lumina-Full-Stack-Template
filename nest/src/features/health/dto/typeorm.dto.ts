import { DataSourceOptions } from 'typeorm';
import { WarningDto } from './health.dto';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { ApiProperty } from '@nestjs/swagger';

export class DatabaseConnectionsDto {
  @ApiProperty({
    example: 0,
    description: 'Number of database connections currently in use',
  })
  public readonly used: number;

  @ApiProperty({
    example: 1,
    description: 'Number of available (idle) database connections in the pool',
  })
  public readonly free: number;

  @ApiProperty({
    example: 0,
    description:
      'Number of pending connection requests waiting for a free connection',
  })
  public readonly queue: number;

  @ApiProperty({
    example: 10,
    description: 'Maximum number of connections allowed in the pool',
  })
  public readonly limit: number;

  @ApiProperty({
    example: 0,
    description:
      'Percentage of connections currently in use, relative to the pool limit',
  })
  public readonly percentUsed: number;

  constructor(payload: Partial<DatabaseConnectionsDto>) {
    this.used = payload.used ?? 0;
    this.free = payload.free ?? 0;
    this.queue = payload.queue ?? 0;
    this.limit = payload.limit ?? 0;
    this.percentUsed = payload.percentUsed ?? 0;
  }
}

export class DatabaseMetricsDto {
  @ApiProperty({
    example: 1277351,
    description: 'Total uptime of the database in seconds',
  })
  public readonly uptimeSec?: number;

  @ApiProperty({
    example: 2,
    description: 'Number of active client sessions connected to the database',
  })
  public readonly sessions?: number;

  @ApiProperty({
    example: 5866,
    description: 'Total number of committed transactions',
  })
  public readonly commits?: number;

  @ApiProperty({
    example: 1,
    description: 'Total number of rolled-back transactions',
  })
  public readonly rollbacks?: number;

  @ApiProperty({
    example: 0,
    description: 'Total number of slow queries executed by the database',
  })
  public readonly slowQueries?: number;

  constructor(payload: Partial<DatabaseMetricsDto>) {
    this.uptimeSec = payload.uptimeSec ?? 0;
    this.sessions = payload.sessions ?? 0;
    this.commits = payload.commits ?? 0;
    this.rollbacks = payload.rollbacks ?? 0;
    this.slowQueries = payload.slowQueries ?? 0;
  }
}

export class DatabaseHealthDtoUp {
  @ApiProperty({
    example: 'mysql',
    description: 'The database engine type (e.g., mysql, postgres, sqlite)',
  })
  public readonly type: DataSourceOptions['type'];

  @ApiProperty({
    example: 'db.example.com',
    description: 'The hostname of the database server',
  })
  public readonly host?: string;

  @ApiProperty({
    example: 3306,
    description: 'The port number the database is listening on',
  })
  public readonly port?: number;

  @ApiProperty({
    example: 'app_db',
    description: 'The name of the connected database/schema',
  })
  public readonly database?: string;

  @ApiProperty({
    example: 34,
    description: 'Round-trip time (ping) to the database in milliseconds',
  })
  public readonly ping: number;

  @ApiProperty({
    type: () => DatabaseConnectionsDto,
    description: 'Connection pool usage and limits',
  })
  public readonly connections: Partial<DatabaseConnectionsDto>;

  @ApiProperty({
    type: () => DatabaseMetricsDto,
    description: 'Database performance metrics and statistics',
  })
  public readonly metrics: DatabaseMetricsDto;

  @ApiProperty({
    type: [WarningDto],
    description: 'List of warnings about database health or performance',
  })
  public readonly warnings: WarningDto[];

  constructor(payload: {
    type: DataSourceOptions['type'];
    host?: string;
    port?: number;
    database?: string;
    ping: number;
    connections?: Partial<DatabaseConnectionsDto>;
    metrics?: Partial<DatabaseMetricsDto>;
    warnings?: WarningDto[];
  }) {
    this.type = payload.type;
    this.host = payload.host;
    this.port = payload.port;
    this.database = payload.database;
    this.ping = payload.ping;
    this.connections = new DatabaseConnectionsDto(payload.connections ?? {});
    this.metrics = new DatabaseMetricsDto(payload.metrics ?? {});
    this.warnings = payload.warnings ?? [];
  }
}

export type DbHealthResult =
  | HealthIndicatorResult<'typeorm', 'up', DatabaseHealthDtoUp>
  | HealthIndicatorResult<'typeorm', 'down', { reason: string }>;
