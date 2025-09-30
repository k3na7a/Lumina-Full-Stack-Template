import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Entity, Column } from 'typeorm';

import {
  ActorType,
  Action,
  Domain,
  SUB_DOMAIN,
  SourceType,
} from '@lib/dto/audit.dto';

@Entity({ name: 'audit_event' })
export class AuditEntity extends BaseEntity {
  @ApiPropertyOptional({
    description:
      'ID of the actor that triggered the event (user/system/service).',
    example: 'ngvJTAn5KDSbuBmixsJJP',
    type: String,
    nullable: true,
  })
  @Column({ type: 'text', nullable: true, default: null })
  public readonly actorId?: string | null;

  @ApiPropertyOptional({
    description:
      'Human-readable label for the of the actor that triggered the event.',
    example: 'Jane Doe <jane.doe@example.com>',
    type: String,
    nullable: true,
  })
  @Column({ type: 'text', nullable: true, default: null })
  public readonly actorDisplay?: string | null;

  @ApiProperty({
    description: 'Type of actor who performed the action.',
    example: ActorType.USER,
    enum: ActorType,
  })
  @Column({ type: 'enum', enum: ActorType })
  public readonly actorType!: ActorType;

  @ApiPropertyOptional({
    description: 'IP address of the actor, if available.',
    example: '192.168.0.1',
    type: String,
    nullable: true,
  })
  @Column({ type: 'text', nullable: true, default: null })
  public readonly actorIp?: string | null;

  @ApiPropertyOptional({
    description: 'User agent string of the actor (browser, device, etc.).',
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    type: String,
    nullable: true,
  })
  @Column({ type: 'text', nullable: true, default: null })
  public readonly actorUa?: string | null;

  @ApiProperty({
    description: 'Action performed by the actor.',
    example: Action.UPDATE,
    enum: Action,
  })
  @Column({ type: 'enum', enum: Action })
  public readonly action!: Action;

  @ApiProperty({
    description: 'Domain/module this audit event belongs to.',
    example: Domain.USER_MANAGEMENT,
    enum: Domain,
  })
  @Column({ type: 'enum', enum: Domain })
  public readonly domain!: Domain;

  @ApiProperty({
    description: 'Type of entity that was affected.',
    example: SUB_DOMAIN.USER,
    enum: SUB_DOMAIN,
  })
  @Column({ type: 'enum', enum: SUB_DOMAIN })
  public readonly subDomain!: SUB_DOMAIN;

  @ApiProperty({
    description: 'Identifier of the entity that was affected.',
    example: 'ngvJTAn5KDSbuBmixsJJP',
  })
  @Column()
  public readonly entityId!: string;

  @ApiPropertyOptional({
    description: 'Human-readable label for the entity.',
    example: 'Jane Doe <jane.doe@example.com>',
    type: String,
    nullable: true,
  })
  @Column({ type: 'text', nullable: true, default: null })
  public readonly entityDisplay?: string | null;

  @ApiPropertyOptional({
    description: 'Correlation ID of the request that triggered the event.',
    example: 'vi3iZropvFNZOKT4J97HR',
    type: String,
    nullable: true,
  })
  @Column({ type: 'text', nullable: true, default: null })
  public readonly requestId!: string | null;

  @ApiPropertyOptional({
    description: 'ID of the job that triggered the event, if applicable.',
    example: '7VtKfpTa7ETRCCNte1vzQ',
    type: String,
    nullable: true,
  })
  @Column({ type: 'text', nullable: true, default: null })
  public readonly jobId!: string | null;

  @ApiProperty({
    description:
      'Source of the event (web, API, admin UI, worker, cron, webhook).',
    example: SourceType.WEB,
    enum: SourceType,
  })
  @Column({ type: 'enum', enum: SourceType })
  public readonly source!: SourceType;

  @ApiPropertyOptional({
    description: 'State of the entity before the action.',
    type: Object,
    nullable: true,
  })
  @Column({ type: 'json', nullable: true })
  public readonly before?: Record<string, unknown> | null;

  @ApiPropertyOptional({
    description: 'State of the entity after the action.',
    type: Object,
    nullable: true,
  })
  @Column({ type: 'json', nullable: true })
  public readonly after?: Record<string, unknown> | null;

  @ApiPropertyOptional({
    description: 'Minimal diff between before and after states.',
    type: Object,
    nullable: true,
  })
  @Column({ type: 'json', nullable: true })
  public readonly diff?: Record<string, unknown> | null;

  @ApiPropertyOptional({
    description: 'Optional reason provided for the action.',
    example: 'User requested account deletion',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true, default: null })
  public readonly reason?: string | null;

  @ApiPropertyOptional({
    description: 'Additional metadata relevant to the event.',
    type: Object,
    nullable: true,
  })
  @Column({ type: 'json', nullable: true })
  public readonly metadata?: Record<string, unknown> | null;
}
