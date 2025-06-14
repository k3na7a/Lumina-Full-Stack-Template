// src/app/games/entities/platform.entity.ts
import { Entity, Column, ManyToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { GameEntity } from './game.entity';
import { BaseEntity } from 'src/library/data/entities/base.entity';

@Entity('platforms')
export class PlatformEntity extends BaseEntity {
  @ApiProperty({ example: 'Nintendo Switch' })
  @Column()
  public readonly name!: string;

  @Column()
  @ApiProperty({
    example: new Date('2017-03-03'),
    description: 'Date the platform was released',
  })
  public readonly release_date!: Date;

  @ApiProperty({
    example: 'nintendo-switch',
    description: 'Used for slugs or frontend identifiers',
  })
  @Column({ unique: true })
  public readonly slug!: string;

  @ManyToMany(() => GameEntity, (game) => game.platforms)
  public readonly games: GameEntity[];
}
