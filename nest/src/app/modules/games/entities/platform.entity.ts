import { Entity, Column, ManyToMany } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { BaseEntity } from 'src/library/entities/base.entity';
import { GameEntity } from 'src/app/modules/games/entities/game.entity';

@Entity('platforms')
export class PlatformEntity extends BaseEntity {
  @ApiProperty({
    example: 'Nintendo Switch',
    description: 'The name of the platform',
  })
  @Column()
  public readonly name!: string;

  @Column()
  @ApiProperty({
    example: new Date('2017-03-03T00:00:00.000Z'),
    description: 'Date the platform was released',
  })
  public readonly release_date!: Date;

  @ApiProperty({
    example: 'nintendo-switch',
    description: 'Used for slugs or frontend identifiers',
  })
  @Column({ unique: true })
  public readonly slug!: string;

  @ApiPropertyOptional({
    example: 42,
    description: 'Number of games linked to this platform',
  })
  @Column({ select: false })
  public readonly gameCount?: number;

  @ManyToMany(() => GameEntity, (game) => game.platforms)
  public readonly games: GameEntity[];
}
