import { SetMetadata } from '@nestjs/common';
import { PermissionsKey } from 'src/library/constants/permissions.constants';

export const PERMISSIONS_KEY = 'permissions';

export const Permissions = (...permissions: PermissionsKey[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
