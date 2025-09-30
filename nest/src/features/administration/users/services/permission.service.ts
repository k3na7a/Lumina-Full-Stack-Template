import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PermissionEntity } from 'src/modules/users/entities/permission.entity';
import { PermissionService } from 'src/modules/users/services/permissions.service';

import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  CreatePermissionDto,
  PermissionPaginationOptions,
} from 'src/modules/users/dto/permission.dto';
import { AuditService } from 'src/modules/audit/service/audit.service';
import { RequestContext } from 'src/common/providers/request-context.provider';
import { iaudit } from 'src/modules/audit/dto/audit.dto';
import { AuditEntity } from 'src/modules/audit/entities/audit.entity';
import {
  buildAuditSnapshotsAndDiff,
  redactHeaders,
} from '@lib/utilities/object.util';
import {
  Action,
  ActorType,
  Domain,
  SourceType,
  SUB_DOMAIN,
} from '@lib/dto/audit.dto';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class PermissionAdminService {
  constructor(
    private readonly service: PermissionService,
    private readonly auditService: AuditService,
    private readonly requestContext: RequestContext,
  ) {}

  public async create(dto: CreatePermissionDto): Promise<PermissionEntity> {
    const permission = await this.service.create(dto);

    await this.audit({
      action: Action.CREATE,
      entityId: permission.id,
      entityDisplay: permission.name,
      before: instanceToPlain({}),
      after: instanceToPlain(permission),
      reason: 'System permission added by administrator.',
    });

    return permission;
  }

  public async paginate(
    params: PermissionPaginationOptions,
  ): Promise<PaginationDto<PermissionEntity>> {
    return this.service.paginate(params);
  }

  public async findOneById(id: string): Promise<PermissionEntity> {
    return this.service.findOneById(id);
  }

  public async remove(id: string): Promise<PermissionEntity> {
    const permission = await this.service.findOneById(id);

    if (permission.isSystemPermission)
      throw new UnauthorizedException('System permissions cannot be removed.');

    await this.audit({
      action: Action.DELETE,
      entityId: permission.id,
      entityDisplay: permission.name,
      before: instanceToPlain(permission),
      after: instanceToPlain({}),
      reason: 'System permission removed by administrator.',
    });

    return this.service.remove(permission.id);
  }

  public async update(
    id: string,
    dto: CreatePermissionDto,
  ): Promise<PermissionEntity> {
    const permission = await this.service.findOneById(id);

    if (permission.isSystemPermission)
      throw new UnauthorizedException('System permissions cannot be modified.');

    await this.service.update(permission.id, dto);
    const updatedPermission = await this.service.findOneById(permission.id);

    await this.audit({
      action: Action.UPDATE,
      entityId: updatedPermission.id,
      entityDisplay: updatedPermission.name,
      before: instanceToPlain(permission),
      after: instanceToPlain(updatedPermission),
      reason: 'System permission updated by administrator.',
    });

    return updatedPermission;
  }

  private async audit(payload: iaudit): Promise<AuditEntity> {
    const { diff, beforeRedacted, afterRedacted } = buildAuditSnapshotsAndDiff(
      payload.before,
      payload.after,
    );

    const { request } = this.requestContext.getStore() ?? {};
    const { url, method, headers } = request ?? {};

    return this.auditService.create({
      ...payload,
      actorType: ActorType.USER,
      source: SourceType.ADMIN_UI,
      domain: Domain.USER_MANAGEMENT,
      subDomain: SUB_DOMAIN.PERMISSION,
      before: beforeRedacted,
      after: afterRedacted,
      diff: diff,
      metadata: {
        path: url,
        method,
        headers: headers ? redactHeaders(headers) : undefined,
      },
    });
  }
}
