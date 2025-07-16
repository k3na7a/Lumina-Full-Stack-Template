import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';

import { BaseEntity } from 'src/library/entities/base.entity';
import { UserEntity } from './user.entity';
import { PermissionEntity } from './permission.entity';
@Entity('roles')
export class RoleEntity extends BaseEntity {
  @ApiProperty({
    description: 'Machine-readable key.',
    example: 'ADMINISTRATOR',
  })
  @Column({ unique: true })
  public readonly name!: string;

  @ApiProperty({
    description: 'Human-friendly name.',
    example: 'Administrator',
  })
  @Column()
  public readonly label!: string;

  @ApiProperty({
    description: 'What the role means.',
    example: 'Has full access to all resources.',
  })
  @Column({ type: 'text', nullable: true, default: null })
  public readonly description?: string;

  @ApiProperty({
    description:
      'Is this a system role that should be protected from deletion?',
    example: false,
  })
  @Column({ type: 'boolean', default: false })
  public readonly isSystemRole!: boolean;

  @ManyToMany(() => UserEntity, (user) => user.roles)
  public readonly users: UserEntity[];

  @ApiProperty({
    description: 'List of permissions available to this role.',
    type: () => [PermissionEntity],
  })
  @ManyToMany(
    () => PermissionEntity,
    (permission: PermissionEntity) => permission.roles,
    {
      cascade: true,
      eager: true,
    },
  )
  @JoinTable({
    name: 'role_permissions',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  public readonly permissions: PermissionEntity[];
}
