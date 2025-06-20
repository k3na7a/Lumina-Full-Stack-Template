import { ApiProperty } from '@nestjs/swagger';
import { AfterLoad, Column, Entity } from 'typeorm';
import { Exclude } from 'class-transformer';

import { BaseEntity } from 'src/library/entities/base.entity';
import { HandlebarsPlugin } from 'src/plugins/handlebars.plugin';
import { IMAGE_TYPE } from 'src/library/enums/image-routes.enum';

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

  @ApiProperty({
    description: 'MIME type of the image file.',
    example: 'image/png',
  })
  @Column()
  public readonly mimetype!: string;

  @ApiProperty({
    description: 'Size of the image in bytes.',
    example: 45831,
  })
  @Column()
  public readonly size!: number;

  @ApiProperty({
    required: false,
    description: 'Width of the image in pixels.',
    example: 1920,
  })
  @Column({ nullable: true })
  public readonly width?: number;

  @ApiProperty({
    description: 'Height of the image in pixels.',
    required: false,
    example: 1080,
  })
  @Column({ nullable: true })
  public readonly height?: number;

  @ApiProperty({
    description: 'Alternative text for accessibility or SEO.',
    example: 'Cover art for Super Mario Bros.',
    required: false,
  })
  @Column({ nullable: true })
  public readonly altText?: string;

  @ApiProperty({
    description: 'Public URI to access the image.',
    example: 'https://cdn.example.com/games/cover/super-mario.png',
  })
  public uri!: string;

  @AfterLoad()
  updateUri(): void {
    const compile = HandlebarsPlugin.compile;
    this.uri = compile<{
      type: string;
      route?: string;
      filename: string;
    }>({
      template: '{{ route }}/{{ type }}/{{ filename }}',
      data: {
        type: this.type,
        route: process.env.AWS_S3_URL,
        filename: this.filename,
      },
    });
  }
}
