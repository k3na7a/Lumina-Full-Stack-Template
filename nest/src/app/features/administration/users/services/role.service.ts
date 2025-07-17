import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RoleEntity } from 'src/app/modules/users/entities/role.entity';
import { RoleService } from 'src/app/modules/users/services/roles.service';

import {
  PaginationDto,
  PaginationOptions,
} from 'src/app/common/dto/pagination.dto';
import { CreateRoleDto } from '../dto/role.dto';
import { PermissionService } from 'src/app/modules/users/services/permissions.service';

@Injectable()
export class RoleAdminService {
  constructor(
    private readonly service: RoleService,
    private readonly permissionService: PermissionService,
  ) {}

  public async create(dto: CreateRoleDto): Promise<RoleEntity> {
    const permissions = await this.permissionService.findManyById(
      dto.permissions,
    );

    return this.service.create({ ...dto, permissions });
  }

  public async paginate(
    params: PaginationOptions,
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

    return this.service.findOneById(role.id);
  }
}
