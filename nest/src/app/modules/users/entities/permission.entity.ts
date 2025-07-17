import { Entity, Column, ManyToMany } from 'typeorm';
import { RoleEntity } from './role.entity';
import { BaseEntity } from 'src/app/common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { PermissionDomain } from '@lib/constants/permissions.constants';

@Entity('permissions')
export class PermissionEntity extends BaseEntity {
  @ApiProperty({
    description: 'Unique machine-level identifier for the permission.',
    example: 'read_user',
  })
  @Column({ unique: true })
  public readonly name!: string;

  @ApiProperty({
    description: 'Human-readable label for the permission.',
    example: 'View Users',
  })
  @Column()
  public readonly label!: string;

  @ApiProperty({
    description: 'Description of the permission.',
    example: 'Allows the user to view user details.',
  })
  @Column({ nullable: true })
  public readonly description?: string;

  @ApiProperty({
    enum: PermissionDomain,
    description: 'Domain is a logical grouping for your permissions.',
    example: PermissionDomain.USER_MANAGEMENT,
  })
  @Column({
    type: 'enum',
    enum: PermissionDomain,
  })
  public readonly domain!: PermissionDomain;

  @ApiProperty({
    description:
      'Is this a system permission that should be protected from deletion?',
    example: false,
  })
  @Column({ default: false })
  public readonly isSystemPermission!: boolean;

  @ManyToMany(() => RoleEntity, (role: RoleEntity) => role.permissions)
  public readonly roles: RoleEntity[];
}
