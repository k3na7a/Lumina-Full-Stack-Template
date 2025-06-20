import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { OneToOne, Column, Entity } from 'typeorm';

import { BaseEntity } from 'src/library/entities/base.entity';
import { Role } from 'src/library/enums/role.enum';
import { ProfileEntity } from 'src/app/modules/users/entities/profile.entity';

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

  @ApiProperty({
    enum: Role,
    description: 'Role of the user in the application',
    example: Role.USER,
  })
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  public readonly role!: Role;

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
}
