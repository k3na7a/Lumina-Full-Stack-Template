import { DataSourceOptions } from 'typeorm';
import { DownDto, Warning, WarningDto } from './health.dto';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { ApiProperty } from '@nestjs/swagger';

export class DatabaseConnectionsDto {
  @ApiProperty({ example: 0 }) used: number;
  @ApiProperty({ example: 1 }) free: number;
  @ApiProperty({ example: 0 }) queue: number;
  @ApiProperty({ example: 10 }) limit: number;
  @ApiProperty({ example: 0 }) percentUsed: number;
}

export class DatabaseMetricsDto {
  @ApiProperty({ example: 1277351 }) uptimeSec?: number;
  @ApiProperty({ example: 2 }) sessions?: number;
  @ApiProperty({ example: 5866 }) commits?: number;
  @ApiProperty({ example: 1 }) rollbacks?: number;
  @ApiProperty({ example: 0 }) slowQueries?: number;
}

export class DatabaseHealthDtoUp {
  @ApiProperty({ example: 'mysql' })
  type: DataSourceOptions['type'];

  @ApiProperty({ example: 'db.example.com' })
  host?: string;

  @ApiProperty({ example: 3306 })
  port?: number;

  @ApiProperty({ example: 'app_db' })
  database?: string;

  @ApiProperty({ example: 34 })
  ping: number;

  @ApiProperty({ type: () => DatabaseConnectionsDto })
  connections: Partial<DatabaseConnectionsDto>;

  @ApiProperty({ type: () => DatabaseMetricsDto })
  metrics: DatabaseMetricsDto;

  @ApiProperty({ type: [WarningDto] })
  warnings: WarningDto[];
}

export type DatabaseHealthDto = DatabaseHealthDtoUp | DownDto;

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

export type TypeOrmServiceHealth =
  | ({ status: 'up' } & ITypeOrmHealth)
  | { status: 'down'; reason: string };

export type DbHealthResult =
  | HealthIndicatorResult<'typeorm', 'up', ITypeOrmHealth>
  | HealthIndicatorResult<'typeorm', 'down', { reason: string }>;
