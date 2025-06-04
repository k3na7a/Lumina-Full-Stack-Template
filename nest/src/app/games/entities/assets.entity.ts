import { ApiProperty } from '@nestjs/swagger';
import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from 'src/library/data/entities/base.entity';
import { ImageEntity } from 'src/app/media/entities/image.entity';
import { GameEntity } from './game.entity';

@Entity('assets')
export class AssetsEntity extends BaseEntity {
  @ApiProperty({ type: () => ImageEntity, required: false })
  @ManyToOne(() => ImageEntity, {
    cascade: ['insert', 'update'],
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'cover_id' })
  public readonly coverLarge!: ImageEntity | null;

  @OneToOne(() => GameEntity, (game: GameEntity) => game.assets, {
    onDelete: 'CASCADE',
  })
  public game!: GameEntity;
}
