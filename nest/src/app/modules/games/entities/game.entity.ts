import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/library/entities/base.entity';

import { Column, Entity, JoinTable, ManyToMany, OneToOne } from 'typeorm';
import { PlatformEntity } from './platform.entity';
import { GenreEntity } from './genre.entity';
import { CoverEntity } from './cover.entity';
import { SeriesEntity } from './series.entity';
import { DeveloperEntity } from './developer.entity';
import { PublisherEntity } from './publisher.entity';
import { GametypeEntity } from './gametype.entity';

@Entity()
class GameEntity extends BaseEntity {
  @ApiProperty()
  @Column()
  public readonly name!: string;

  @ApiProperty()
  @Column()
  public readonly release_date!: Date;

  @ApiProperty({ type: () => CoverEntity })
  @OneToOne(() => CoverEntity, (cover: CoverEntity) => cover.game, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  public readonly cover!: CoverEntity | null;

  @ApiProperty({ type: [PlatformEntity] })
  @ManyToMany(() => PlatformEntity, { eager: true })
  @JoinTable({
    name: 'game_platforms',
    joinColumn: {
      name: 'game_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: { name: 'platform_id', referencedColumnName: 'id' },
  })
  public readonly platforms?: Array<PlatformEntity>;

  @ApiProperty({ type: [GenreEntity] })
  @ManyToMany(() => GenreEntity, { eager: true })
  @JoinTable({
    name: 'game_genres',
    joinColumn: {
      name: 'game_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: { name: 'genre_id', referencedColumnName: 'id' },
  })
  public readonly genres?: Array<GenreEntity>;

  @ApiProperty({ type: [SeriesEntity] })
  @ManyToMany(() => SeriesEntity, { eager: true })
  @JoinTable({
    name: 'game_series',
    joinColumn: {
      name: 'game_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: { name: 'series_id', referencedColumnName: 'id' },
  })
  public readonly series?: Array<SeriesEntity>;

  @ApiProperty({ type: [DeveloperEntity] })
  @ManyToMany(() => DeveloperEntity, { eager: true })
  @JoinTable({
    name: 'game_developers',
    joinColumn: {
      name: 'game_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: { name: 'developer_id', referencedColumnName: 'id' },
  })
  public readonly developers?: Array<DeveloperEntity>;

  @ApiProperty({ type: [PublisherEntity] })
  @ManyToMany(() => PublisherEntity, { eager: true })
  @JoinTable({
    name: 'game_publishers',
    joinColumn: {
      name: 'game_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: { name: 'publisher_id', referencedColumnName: 'id' },
  })
  public readonly publishers?: Array<PublisherEntity>;

  @ApiProperty({ type: [GametypeEntity] })
  @ManyToMany(() => GametypeEntity, { eager: true })
  @JoinTable({
    name: 'game_gametypes',
    joinColumn: {
      name: 'game_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: { name: 'gametype_id', referencedColumnName: 'id' },
  })
  public readonly gametypes?: Array<GametypeEntity>;

  @ApiProperty()
  @Column({ unique: true })
  public readonly slug!: string;
}

export { GameEntity };
