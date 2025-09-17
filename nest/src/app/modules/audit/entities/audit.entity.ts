import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Entity, Column, BaseEntity } from 'typeorm';

export enum ActorType {
  USER = 'user',
  SYSTEM = 'system',
  SERVICE = 'service',
}

export enum SourceType {
  API = 'api',
  WEB = 'web',
  ADMIN_UI = 'admin-ui',
  WORKER = 'worker',
  CRON = 'cron',
  WEBHOOK = 'webhook',
}

@Entity({ name: 'audit_event' })
export class AuditEvent extends BaseEntity {
  // Actor
  @ApiPropertyOptional({
    description:
      'ID of the actor that triggered the event (user/system/service).',
    example: 'ngvJTAn5KDSbuBmixsJJP',
    nullable: true,
  })
  @Column({ nullable: true, default: null })
  public readonly actorId?: string | null;

  @ApiProperty({
    description: 'Type of actor who performed the action.',
    example: ActorType.USER,
    enum: ActorType,
  })
  @Column({
    type: 'enum',
    enum: ActorType,
  })
  public readonly actorType!: ActorType;

  @ApiPropertyOptional({
    description: 'IP address of the actor, if available.',
    example: '192.168.0.1',
    nullable: true,
  })
  @Column({ nullable: true, default: null })
  public readonly actorIp?: string | null;

  //   @Column({ name: 'actor_ua', type: 'varchar', length: 512, nullable: true })
  //   actorUa!: string | null;

  // Action / Entity
  //   @Column({ type: 'varchar', length: 64 })
  //   action!: string;

  //   @Column({ name: 'entity_type', type: 'varchar', length: 64 })
  //   entityType!: string;

  //   @Column({ name: 'entity_id', type: 'varchar', length: 128 })
  //   entityId!: string;

  //   @Column({
  //     name: 'entity_display',
  //     type: 'varchar',
  //     length: 256,
  //     nullable: true,
  //   })
  //   entityDisplay!: string | null;

  // Domain scoping
  //   @Column({ type: 'varchar', length: 64 })
  //   domain!: string;

  //   @Column({ type: 'varchar', length: 64, nullable: true })
  //   subdomain!: string | null;

  // Correlation
  //   @Column({ name: 'request_id', type: 'varchar', length: 128, nullable: true })
  //   requestId!: string | null;

  //   @Column({ name: 'job_id', type: 'varchar', length: 128, nullable: true })
  //   jobId!: string | null;

  //   @Column({ type: 'varchar', length: 32, default: 'api' })
  //   source!: SourceType;

  // Payloads (use MySQL JSON)
  //   @Column({ type: 'json', nullable: true })
  //   before!: Record<string, unknown> | null;

  //   @Column({ type: 'json', nullable: true })
  //   after!: Record<string, unknown> | null;

  //   @Column({ type: 'json', nullable: true })
  //   diff!: Record<string, unknown> | null;

  //   @Column({ type: 'text', nullable: true })
  //   reason!: string | null;

  //   @Column({ type: 'json', nullable: true })
  //   metadata!: Record<string, unknown> | null;

  // Idempotency (optional but recommended)
  //   @Column({
  //     name: 'idempotency_key',
  //     type: 'varchar',
  //     length: 128,
  //     nullable: true,
  //     unique: true,
  //   })
  //   idempotencyKey!: string | null;
}
