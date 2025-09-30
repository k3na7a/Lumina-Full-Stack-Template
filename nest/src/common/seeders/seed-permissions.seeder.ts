import { DataSource } from 'typeorm';
import { PERMISSIONS_SEED } from '@lib/seeds/permissions.seed';
import { PermissionEntity } from 'src/modules/users/entities/permission.entity';

export async function seedPermissions(dataSource: DataSource) {
  const permissionRepo = dataSource.getRepository(PermissionEntity);

  for (const seed of PERMISSIONS_SEED) {
    const existing = await permissionRepo.findOneBy({ name: seed.key });
    if (!existing) {
      const permission = permissionRepo.create({
        name: seed.key,
        label: seed.label,
        description: seed.description,
        domain: seed.domain,
        isSystemPermission: true,
      });
      await permissionRepo.save(permission);
    }
  }
}
