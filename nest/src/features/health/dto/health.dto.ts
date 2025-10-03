import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import {
  RedisHealthResult,
  RedisHealthUpDto,
  RedisServiceHealth,
} from './redis.dto';
import { BullHealthUpDto, BullMQQueueHealth } from './bull.dto';
import {
  SystemHealthDto,
  SystemHealthResult,
  SystemServiceHealth,
} from './system.dto';
import {
  DatabaseHealthDto,
  DatabaseHealthDtoUp,
  DbHealthResult,
  TypeOrmServiceHealth,
} from './typeorm.dto';

export class DownDto {
  @ApiProperty({ example: 'down' })
  status: 'down';

  @ApiProperty({
    description: 'Reason why the service is unhealthy',
    example: 'Connection refused',
  })
  public readonly reason: string;
}

export class WarningDto {
  @ApiProperty({
    description: 'Human-readable warning message about a potential issue',
    example: 'High connection pool usage (9/10)',
  })
  public readonly message: string;
  @ApiProperty({
    description: 'Severity level of the warning',
    example: 'warning',
    enum: ['info', 'warning', 'critical'],
  })
  public readonly severity: WarningSeverity;
}

export class ServicesHealthDto {
  @ApiProperty({ type: () => SystemHealthDto })
  public readonly system: SystemHealthDto;
  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(RedisHealthUpDto) },
      { $ref: getSchemaPath(DownDto) },
    ],
  })
  public readonly redis: RedisHealthUpDto | DownDto;
  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(DatabaseHealthDtoUp) },
      { $ref: getSchemaPath(DownDto) },
    ],
  })
  public readonly typeorm: DatabaseHealthDto;
}

export class QueueHealthDto {
  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(BullHealthUpDto) },
      { $ref: getSchemaPath(DownDto) },
    ],
  })
  public readonly logger: BullHealthUpDto | DownDto;
  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(BullHealthUpDto) },
      { $ref: getSchemaPath(DownDto) },
    ],
  })
  public readonly logger_dlq: BullHealthUpDto | DownDto;
  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(BullHealthUpDto) },
      { $ref: getSchemaPath(DownDto) },
    ],
  })
  public readonly email: BullHealthUpDto | DownDto;
  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(BullHealthUpDto) },
      { $ref: getSchemaPath(DownDto) },
    ],
  })
  public readonly email_dlq: BullHealthUpDto | DownDto;
}

export class HealthResponseDto {
  @ApiProperty({ description: 'Overall health status', example: 'ok' })
  public readonly status: string;

  @ApiProperty({ type: () => ServicesHealthDto })
  public readonly services: ServicesHealthDto;

  @ApiProperty({ type: () => QueueHealthDto })
  public readonly queues: QueueHealthDto;

  @ApiProperty({
    description: 'Timestamp when the health check was executed (epoch ms)',
    example: 1725116400000,
  })
  public readonly timestamp: number;

  constructor(raw: {
    status: string;
    details: ServicesHealthDto;
    queues: QueueHealthDto;
  }) {
    this.status = raw.status;
    this.services = raw.details;
    this.queues = raw.queues;
    this.timestamp = new Date().getTime();
  }
}

export type AllHealthResults =
  | SystemHealthResult
  | RedisHealthResult
  | DbHealthResult;

export interface ServicesHealth {
  redis: RedisServiceHealth;
  system: SystemServiceHealth;
  typeorm: TypeOrmServiceHealth;
}

export interface QueueHealth {
  logger: BullMQQueueHealth;
  logger_dlq: BullMQQueueHealth;
  email: BullMQQueueHealth;
  email_dlq: BullMQQueueHealth;
}

export type WarningSeverity = 'info' | 'warning' | 'critical';

export interface Warning {
  message: string;
  severity: WarningSeverity;
}
