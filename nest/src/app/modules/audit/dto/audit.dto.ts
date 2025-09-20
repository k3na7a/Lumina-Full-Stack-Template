import { PaginationOptions } from 'src/app/common/dto/pagination.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Action, Domain } from '@lib/dto/audit.dto';

enum SORT_OPTIONS {
  CREATED = 'audit_event.createdAt',
}

export class AuditPaginationOptionss extends PaginationOptions {
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
  metadata?: Record<string, unknown> | null;
}
