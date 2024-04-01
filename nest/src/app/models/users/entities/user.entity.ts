import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { Column } from 'typeorm/decorator/columns/Column';
import { Entity } from 'typeorm/decorator/entity/Entity';

import { BaseEntity } from 'src/library/entities/base.entity';
import { Role } from 'src/library/enums/role.enum';

@Entity()
export class UserEntity extends BaseEntity {
  @ApiProperty()
  @Column({ unique: true })
  public readonly email!: string;

  @Column()
  @Exclude()
  public readonly password!: string;

  @ApiProperty({ enum: Role })
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  public readonly role: Role;

  @Column({ type: 'text', nullable: true, default: null })
  @Exclude()
  public readonly refreshToken!: string | null;
}
