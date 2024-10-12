import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/library/entities/base.entity';

import { Column, Entity } from 'typeorm';

@Entity()
class PlatformEntity extends BaseEntity {
  @ApiProperty()
  @Column()
  public readonly name!: string;

  @ApiProperty()
  @Column()
  public readonly release_date!: Date;

  @ApiProperty()
  @Column()
  public readonly abbreviation!: string;

  @ApiProperty()
  @Column({ unique: true })
  public readonly slug!: string;
}

export { PlatformEntity };
