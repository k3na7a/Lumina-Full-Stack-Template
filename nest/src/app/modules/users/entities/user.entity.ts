import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { OneToOne, Column, Entity, ManyToMany, JoinTable } from 'typeorm';

import { BaseEntity } from 'src/library/entities/base.entity';
import { ProfileEntity } from 'src/app/modules/users/entities/profile.entity';
import { RoleEntity } from './role.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @ApiProperty({
    description: 'The users associated email address',
    example: 'email@example.com',
  })
  @Column({ unique: true })
  public readonly email!: string;

  @Column()
  @Exclude()
  public readonly password!: string;

  @Column({ type: 'text', nullable: true, default: null })
  @Exclude()
  public readonly refreshToken?: string | null;

  @Column({ type: 'text', nullable: true, default: null })
  @Exclude()
  public readonly resetToken?: string | null;

  @ApiProperty({
    type: () => ProfileEntity,
    description: 'Linked user profile',
  })
  @OneToOne(() => ProfileEntity, (profile: ProfileEntity) => profile.user, {
    cascade: true,
    eager: true,
  })
  public readonly profile!: ProfileEntity;

  @ApiProperty({
    description: 'List of roles available to this user.',
    type: () => [RoleEntity],
  })
  @ManyToMany(() => RoleEntity, (role: RoleEntity) => role.users, {
    cascade: true,
    eager: true,
  })
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  public readonly roles: RoleEntity[];
}
