import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/library/entities/base.entity';

import { Column, Entity } from 'typeorm';

@Entity()
class DeveloperEntity extends BaseEntity {
  @ApiProperty()
  @Column()
  public readonly name!: string;

  @ApiProperty()
  @Column({ unique: true })
  public readonly slug!: string;
}

export { DeveloperEntity };
