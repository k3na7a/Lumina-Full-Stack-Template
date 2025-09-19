import { BaseInterface } from 'src/app/common/dto/base.dto';
import {
  Action,
  ActorType,
  Domain,
  SourceType,
  SUB_DOMAIN,
} from '../entities/audit.entity';
import { PaginationOptions } from 'src/app/common/dto/pagination.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

enum SORT_OPTIONS {
  CREATED = 'audit.createdAt',
}

export class AuditPaginationOptions extends PaginationOptions {
  @ApiPropertyOptional({
    description: 'Sort order for the audit event list. Defaults to `CREATED`.',
    enum: SORT_OPTIONS,
    default: SORT_OPTIONS.CREATED,
    example: SORT_OPTIONS.CREATED,
  })
  @IsEnum(SORT_OPTIONS)
  @IsOptional()
  public readonly sort: SORT_OPTIONS = SORT_OPTIONS.CREATED;

  @ApiPropertyOptional({
    description: 'Domain/module to filter for in pagination event.',
    enum: Domain,
    default: null,
    example: Domain.USER_MANAGEMENT,
  })
  @IsEnum(Domain)
  @IsOptional()
  public readonly domain: Domain | null = null;
}

export interface iaudit {
  action: Action;
  entityId: string;
  entityDisplay: string;
  before: Record<string, unknown>;
  after: Record<string, unknown>;
  reason: string;
  metadata: Record<string, unknown> | null;
}

export interface AuditEvent extends BaseInterface {
  actorId?: string | null;
  actorIp?: string | null;
  actorUa?: string | null;

  requestId?: string | null;
  jobId?: string | null;

  actorType: ActorType;
  source: SourceType;
  domain: Domain;
  subDomain: SUB_DOMAIN;

  action: Action;
  entityId: string;
  entityDisplay?: string | null;

  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  diff?: Record<string, unknown> | null;
  reason?: string | null;
  metadata?: Record<string, unknown> | null;
}

export const JSON = {
  id: '123',
  createdAt: '2025-07-02T12:34:56.789Z',
  editedAt: '2025-07-02T12:34:56.789Z',

  actorId: '42',
  actorIp: '203.0.113.55',
  actorUa: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',

  requestId: 'req-abc123',
  jobId: null,

  source: 'web',
  actorType: 'user',

  domain: 'user_management',
  entityType: 'user',

  action: 'update',

  entityId: '42',
  entityDisplay: 'alice@example.com',

  before: { passwordHash: '***redacted***' },
  after: { passwordHash: '***redacted***' },
  diff: { passwordHash: { before: '***', after: '***' } },

  reason: 'User initiated password reset',
  metadata: {
    path: '/account/reset-password',
    method: 'POST',
    headers: { 'x-request-id': 'req-abc123' },
    mfaVerified: true,
  },
};
