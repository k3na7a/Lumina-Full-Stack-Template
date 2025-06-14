import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

import { BaseEntity } from 'src/library/data/entities/base.entity';
import { ImageEntity } from 'src/app/media/entities/image.entity';
import { PlatformEntity } from './platform.entity';

@Entity('games')
export class GameEntity extends BaseEntity {
  @ApiProperty()
  @Column()
  public readonly name!: string;

  @ApiProperty()
  @Column({ unique: true })
  public readonly slug!: string;

  @ApiPropertyOptional({ type: () => ImageEntity, required: false })
  @ManyToOne(() => ImageEntity, {
    cascade: ['insert', 'update'],
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'cover_id' })
  public readonly cover?: ImageEntity | null;

  @ApiProperty()
  @Column()
  public readonly release_date!: Date;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
  })
  @Column({ type: 'text', nullable: true, default: null })
  public readonly description?: string | null;

  @ApiProperty({ type: () => [PlatformEntity] })
  @ManyToMany(() => PlatformEntity, (platform) => platform.games, {
    cascade: true,
    eager: true,
  })
  @JoinTable({
    name: 'game_platforms',
    joinColumn: {
      name: 'game_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'platform_id',
      referencedColumnName: 'id',
    },
  })
  public readonly platforms: PlatformEntity[];
}
