import { SetMetadata } from '@nestjs/common';

import { Role } from 'src/library/data/enums/role.enum';

const Roles = (roles: Role[]) => SetMetadata('roles', roles);

export { Roles };
