import { DataSource } from 'typeorm';
import { PermissionEntity } from 'src/modules/users/entities/permission.entity';
import { PERMISSIONS_SEED } from '@lib/seeds/permissions.seed';
import { Logger } from '@nestjs/common';
import { Seeder } from '../interfaces/seeder.interface';

export class PermissionSeeder implements Seeder {
  order = 1;

  async run(dataSource: DataSource): Promise<void> {
    const logger = new Logger(PermissionSeeder.name);

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
        logger.log(`Inserted permission: ${seed.key}`);
        continue;
      }

      const hasChanges =
        existing.label !== seed.label ||
        existing.description !== seed.description ||
        existing.domain !== seed.domain;
      if (!hasChanges) continue;

      const permission = permissionRepo.merge(existing, {
        label: seed.label,
        description: seed.description,
        domain: seed.domain,
        isSystemPermission: true,
      });

      await permissionRepo.save(permission);
      logger.log(`Updated permission: ${seed.key}`);
    }
  }
}
