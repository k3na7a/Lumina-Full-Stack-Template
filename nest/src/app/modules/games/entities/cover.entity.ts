import { ApiProperty } from '@nestjs/swagger';
import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { BaseEntity } from 'src/library/entities/base.entity';
import { GameEntity } from './game.entity';
import { HandlebarsPlugin } from 'src/plugins/handlebars.plugin';
import { STORAGE } from 'src/library/enums/files.enum';
import { Exclude } from 'class-transformer';

type uriProps = {
  url: string | undefined;
  filename: string;
};

@Entity()
export class CoverEntity extends BaseEntity {
  @Exclude()
  @Column()
  public readonly filename!: string;

  @ApiProperty()
  public uri!: string | null;

  @OneToOne(() => GameEntity, (game: GameEntity) => game.cover, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public readonly game!: GameEntity;

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  updateUri() {
    const compile = HandlebarsPlugin.compile;
    this.uri = compile<uriProps>({
      template: '{{ url }}/{{ filename }}',
      data: {
        url: process.env.AWS_S3_URL,
        filename: STORAGE.COVERS + this.filename,
      },
    });
  }
}
