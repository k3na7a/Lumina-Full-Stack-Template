import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { OneToOne, Column, Entity, JoinColumn } from 'typeorm';

import { BaseEntity } from 'src/library/entities/base.entity';
import { Role } from 'src/library/enums/role.enum';
import { ProfileEntity } from './profile.entity';

@Entity()
export class UserEntity extends BaseEntity {
  @ApiProperty()
  @Column({ unique: true })
  public readonly email!: string;

  @Column() @Exclude() public readonly password!: string;

  @ApiProperty({ enum: Role })
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  public readonly role!: Role;

  @Column({ type: 'text', nullable: true, default: null })
  @Exclude()
  public readonly refreshToken!: string | null;

  @Column({ type: 'text', nullable: true, default: null })
  @Exclude()
  public readonly resetToken!: string | null;

  @ApiProperty({ type: () => ProfileEntity })
  @OneToOne(() => ProfileEntity, (profile: ProfileEntity) => profile.user, {
    cascade: ['insert', 'update'],
    eager: true,
  })
  @JoinColumn()
  public readonly profile!: ProfileEntity;

  public getFullName(): string {
    return [this.profile.name.first, this.profile.name.last].join(' ');
  }
}
