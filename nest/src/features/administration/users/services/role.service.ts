import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RoleEntity } from 'src/modules/users/entities/role.entity';
import { RoleService } from 'src/modules/users/services/roles.service';

import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  CreateRoleDto,
  RolePaginationOptions,
} from 'src/modules/users/dto/role.dto';
import { PermissionService } from 'src/modules/users/services/permissions.service';
import {
  buildAuditSnapshotsAndDiff,
  redactHeaders,
} from '@lib/utilities/object.util';
import { iaudit } from 'src/modules/audit/dto/audit.dto';
import { AuditEntity } from 'src/modules/audit/entities/audit.entity';
import { AuditService } from 'src/modules/audit/service/audit.service';
import { RequestContext } from 'src/common/providers/request-context.provider';
import {
  Action,
  ActorType,
  Domain,
  SourceType,
  SUB_DOMAIN,
} from '@lib/dto/audit.dto';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class RoleAdminService {
  constructor(
    private readonly service: RoleService,
    private readonly permissionService: PermissionService,
    private readonly auditService: AuditService,
    private readonly requestContext: RequestContext,
  ) {}

  public async create(dto: CreateRoleDto): Promise<RoleEntity> {
    const permissions = await this.permissionService.findManyById(
      dto.permissions,
    );

    const role = await this.service.create({ ...dto, permissions });

    await this.audit({
      action: Action.CREATE,
      entityId: role.id,
      entityDisplay: role.name,
      before: instanceToPlain({}),
      after: instanceToPlain(role),
      reason: 'User role added by administrator.',
    });

    return role;
  }

  public async paginate(
    params: RolePaginationOptions,
  ): Promise<PaginationDto<RoleEntity>> {
    return this.service.paginate(params);
  }

  public async findOneById(id: string): Promise<RoleEntity> {
    return this.service.findOneById(id);
  }

  public async remove(id: string): Promise<RoleEntity> {
    const role = await this.service.findOneById(id);

    if (role.isSystemRole)
      throw new UnauthorizedException('System roles can not be removed.');

    await this.audit({
      action: Action.DELETE,
      entityId: role.id,
      entityDisplay: role.name,
      before: instanceToPlain(role),
      after: instanceToPlain({}),
      reason: 'User role removed by administrator.',
    });

    return this.service.remove(role.id);
  }

  public async update(id: string, dto: CreateRoleDto): Promise<RoleEntity> {
    const role = await this.service.findOneById(id);

    if (role.isSystemRole)
      throw new UnauthorizedException('System roles can not be modified.');

    const permissions = await this.permissionService.findManyById(
      dto.permissions,
    );

    await this.service.update(role.id, {
      ...dto,
      permissions,
    });

    const updatedRole = await this.service.findOneById(role.id);

    await this.audit({
      action: Action.UPDATE,
      entityId: updatedRole.id,
      entityDisplay: updatedRole.name,
      before: instanceToPlain(role),
      after: instanceToPlain(updatedRole),
      reason: 'User role updated by administrator.',
    });

    return updatedRole;
  }

  private async audit(payload: iaudit): Promise<AuditEntity> {
    const { diff, beforeRedacted, afterRedacted } = buildAuditSnapshotsAndDiff(
      payload.before,
      payload.after,
      [],
      ['permissions'],
    );

    const { request } = this.requestContext.getStore() ?? {};
    const { url, method, headers } = request ?? {};

    return this.auditService.create({
      ...payload,
      actorType: ActorType.USER,
      source: SourceType.ADMIN_UI,
      domain: Domain.USER_MANAGEMENT,
      subDomain: SUB_DOMAIN.ROLE,
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
