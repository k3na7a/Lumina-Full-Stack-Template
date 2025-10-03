import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { RedisHealthUpDto } from './redis.dto';
import { BullHealthUpDto } from './bull.dto';
import { SystemHealthDto } from './system.dto';
import { DatabaseHealthDtoUp } from './typeorm.dto';
import { WarningSeverity } from '@lib/dto/health.dto';

export class DownDto {
  @ApiProperty({
    example: 'down',
    description: 'Indicates the service is unavailable/unhealthy',
  })
  public readonly status: 'down';

  @ApiProperty({
    description: 'Reason why the service is unhealthy',
    example: 'Connection refused',
  })
  public readonly reason: string;

  constructor(payload: { reason: string }) {
    this.status = 'down';
    this.reason = payload.reason;
  }
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

  constructor(payload: { message: string; severity: WarningSeverity }) {
    this.message = payload.message;
    this.severity = payload.severity;
  }
}

export class ServicesHealthDto {
  @ApiProperty({
    type: () => SystemHealthDto,
    description: 'System-level host, CPU, memory, disk, and network details',
  })
  public readonly system: SystemHealthDto;

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(RedisHealthUpDto) },
      { $ref: getSchemaPath(DownDto) },
    ],
    description: 'Redis service health',
  })
  public readonly redis: RedisHealthUpDto | DownDto;

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(DatabaseHealthDtoUp) },
      { $ref: getSchemaPath(DownDto) },
    ],
    description: 'Database service health (TypeORM connection)',
  })
  public readonly typeorm: DatabaseHealthDtoUp | DownDto;

  constructor(payload: {
    system: SystemHealthDto;
    redis: RedisHealthUpDto | DownDto;
    typeorm: DatabaseHealthDtoUp | DownDto;
  }) {
    this.system = payload.system;
    this.redis = payload.redis;
    this.typeorm = payload.typeorm;
  }
}

export class QueueHealthDto {
  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(BullHealthUpDto) },
      { $ref: getSchemaPath(DownDto) },
    ],
    description: 'Logger queue health',
  })
  public readonly logger: BullHealthUpDto | DownDto;

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(BullHealthUpDto) },
      { $ref: getSchemaPath(DownDto) },
    ],
    description: 'Logger DLQ (dead-letter queue) health',
  })
  public readonly logger_dlq: BullHealthUpDto | DownDto;

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(BullHealthUpDto) },
      { $ref: getSchemaPath(DownDto) },
    ],
    description: 'Email queue health',
  })
  public readonly email: BullHealthUpDto | DownDto;

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(BullHealthUpDto) },
      { $ref: getSchemaPath(DownDto) },
    ],
    description: 'Email DLQ (dead-letter queue) health',
  })
  public readonly email_dlq: BullHealthUpDto | DownDto;

  constructor(payload: {
    logger: BullHealthUpDto | DownDto;
    logger_dlq: BullHealthUpDto | DownDto;
    email: BullHealthUpDto | DownDto;
    email_dlq: BullHealthUpDto | DownDto;
  }) {
    this.logger = payload.logger;
    this.logger_dlq = payload.logger_dlq;
    this.email = payload.email;
    this.email_dlq = payload.email_dlq;
  }
}

export class HealthResponseDto {
  @ApiProperty({
    description: 'Overall health status of the system',
    example: 'ok',
  })
  public readonly status: string;

  @ApiProperty({
    type: () => ServicesHealthDto,
    description: 'Health of core services: system, Redis, database',
  })
  public readonly services: ServicesHealthDto;

  @ApiProperty({
    type: () => QueueHealthDto,
    description: 'Health of background queues',
  })
  public readonly queues: QueueHealthDto;

  @ApiProperty({
    description: 'Timestamp when the health check was executed (epoch ms)',
    example: 1725116400000,
  })
  public readonly timestamp: number;

  constructor(payload: {
    services: ServicesHealthDto;
    queues: QueueHealthDto;
  }) {
    this.status = 'ok';
    this.services = payload.services;
    this.queues = payload.queues;
    this.timestamp = Date.now();
  }
}
