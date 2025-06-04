import { ApiProperty } from '@nestjs/swagger';
import { AfterLoad, Column, Entity } from 'typeorm';

import { BaseEntity } from 'src/library/data/entities/base.entity';

import { HandlebarsPlugin } from 'src/plugins/handlebars.plugin';
import { Exclude } from 'class-transformer';
import { IMAGE_TYPE } from '../constants/image-routes.constants';

interface uriProps {
  type: string;
  route?: string;
  filename: string;
}

@Entity('images')
export class ImageEntity extends BaseEntity {
  @Exclude()
  @Column()
  public readonly filename!: string;

  @Exclude()
  @Column({
    type: 'enum',
    enum: IMAGE_TYPE,
  })
  public readonly type!: IMAGE_TYPE;

  @ApiProperty()
  @Column()
  public readonly mimetype!: string;

  @ApiProperty()
  @Column()
  public readonly size!: number;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  public readonly width?: number;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  public readonly height?: number;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  public readonly altText?: string;

  @ApiProperty()
  public uri!: string;

  @AfterLoad()
  updateUri(): void {
    const compile = HandlebarsPlugin.compile;
    this.uri = compile<uriProps>({
      template: '{{ route }}/{{ type }}/{{ filename }}',
      data: {
        type: this.type,
        route: process.env.AWS_S3_URL,
        filename: this.filename,
      },
    });
  }
}
