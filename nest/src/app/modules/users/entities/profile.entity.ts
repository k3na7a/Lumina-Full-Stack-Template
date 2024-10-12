import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/library/entities/base.entity';
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { AvatarEntity } from './avatar.entity';

class Name {
  @ApiProperty()
  @Column()
  public readonly first!: string;
  @ApiProperty()
  @Column()
  public readonly last!: string;
}

@Entity()
export class ProfileEntity extends BaseEntity {
  @ApiProperty({ type: () => AvatarEntity })
  @OneToOne(() => AvatarEntity, (avatar: AvatarEntity) => avatar.profile, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  public readonly avatar!: AvatarEntity | null;

  @ApiProperty({ type: Name })
  @Column(() => Name)
  public readonly name!: Name;

  @OneToOne(() => UserEntity, (user: UserEntity) => user.profile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public readonly user!: UserEntity;
}
