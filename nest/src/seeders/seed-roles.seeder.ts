// seeds/roles.seed.ts
// import { Role } from '../entities/role.entity';
// import { Permission } from '../entities/permission.entity';
// import { DataSource } from 'typeorm';

// export async function seedRoles(dataSource: DataSource) {
//   const roleRepo = dataSource.getRepository(Role);
//   const permissionRepo = dataSource.getRepository(Permission);

//   const allPermissions = await permissionRepo.find();

//   const roles = [
//     {
//       name: 'user',
//       label: 'Platform User',
//       permissions: allPermissions.filter((p) =>
//         ['update_self', 'delete_self'].includes(p.name),
//       ),
//     },
//     {
//       name: 'system_administrator',
//       label: 'System Administrator',
//       permissions: allPermissions.filter((p) =>
//         ['has_all_permissions'].includes(p.name),
//       ),
//     },
//   ];

//   for (const role of roles) {
//     const r = roleRepo.create(role);
//     await roleRepo.save(r);
//   }

//   console.log('✅ Seeded roles with permissions');
// }
