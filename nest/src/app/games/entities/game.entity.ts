import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from 'src/library/data/entities/base.entity';
import { AssetsEntity } from './assets.entity';

@Entity('games')
export class GameEntity extends BaseEntity {
  @ApiProperty()
  @Column()
  public readonly name!: string;

  @ApiProperty()
  @Column()
  public readonly release_date!: Date;

  @ApiProperty()
  @Column({ type: 'text', nullable: true, default: null })
  public readonly description!: string | null;

  @ApiProperty()
  @Column({ unique: true })
  public readonly slug!: string;

  @ApiProperty({ type: () => AssetsEntity, required: false })
  @OneToOne(() => AssetsEntity, {
    cascade: true,
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'assets_id' })
  public readonly assets!: AssetsEntity;
}
