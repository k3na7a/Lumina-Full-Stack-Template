import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/library/enums/role.enum';

export const Roles = (roles: Role[]) => SetMetadata('roles', roles);
