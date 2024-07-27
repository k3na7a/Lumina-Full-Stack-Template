import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/library/entities/base.entity';
import { Entity, Column, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';

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
  @ApiProperty({ type: Name })
  @Column(() => Name)
  public readonly name!: Name;

  @OneToOne(() => UserEntity, (user: UserEntity) => user.profile)
  public readonly user!: UserEntity;
}
