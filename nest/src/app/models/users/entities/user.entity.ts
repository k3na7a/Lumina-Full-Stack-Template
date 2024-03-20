import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { Column } from 'typeorm/decorator/columns/Column';
import { Entity } from 'typeorm/decorator/entity/Entity';

import { BaseEntity } from 'src/library/entities/base.entity';

@Entity()
export class UserEntity extends BaseEntity {
  @ApiProperty()
  @Column({ unique: true })
  public email: string;

  @Column()
  @Exclude()
  public password: string;

  @Column({ default: null })
  @Exclude()
  public refreshToken: string;
}
