import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

import { BaseEntity } from 'src/app/common/entities/base.entity';
import { ImageEntity } from 'src/app/modules/media/entities/image.entity';
import { PlatformEntity } from 'src/app/modules/games/entities/platform.entity';

@Entity('games')
export class GameEntity extends BaseEntity {
  @ApiProperty({
    description: 'The title of the game.',
    example: 'Super Mario Bros.',
  })
  @Column()
  public readonly name!: string;

  @ApiProperty({
    description: 'URL-friendly identifier for the game.',
    example: 'super-mario-bros',
  })
  @Column({ unique: true })
  public readonly slug!: string;

  @ApiPropertyOptional({
    description: 'Cover image associated with the game.',
    type: () => ImageEntity,
    required: false,
  })
  @ManyToOne(() => ImageEntity, {
    cascade: ['insert', 'update'],
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'cover_id' })
  public readonly cover?: ImageEntity | null;

  @ApiProperty({
    description: 'Official release date of the game.',
    example: '1985-09-13T00:00:00.000Z',
  })
  @Column()
  public readonly release_date!: Date;

  @ApiPropertyOptional({
    description: 'Optional long-form description or summary of the game.',
    example:
      'An iconic platformer where Mario must rescue Princess Peach from Bowser.',
    type: String,
    nullable: true,
  })
  @Column({ type: 'text', nullable: true, default: null })
  public readonly description?: string | null;

  @ApiProperty({
    description: 'List of platforms this game is available on.',
    type: () => [PlatformEntity],
  })
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
