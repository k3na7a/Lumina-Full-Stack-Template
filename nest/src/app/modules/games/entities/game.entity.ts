import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/library/entities/base.entity';

import { Column, Entity, JoinTable, ManyToMany, OneToOne } from 'typeorm';
import { PlatformEntity } from './platform.entity';
import { GenreEntity } from './genre.entity';
import { CoverEntity } from './cover.entity';

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

  @ApiProperty()
  @Column({ unique: true })
  public readonly slug!: string;
}

export { GameEntity };
