import { ApiProperty } from '@nestjs/swagger';
import { AfterLoad, Column, Entity } from 'typeorm';

import { BaseEntity } from 'src/library/data/entities/base.entity';

import { HandlebarsPlugin } from 'src/plugins/handlebars.plugin';
import { Exclude } from 'class-transformer';
import { NotAcceptableException } from '@nestjs/common';

export enum IMAGE_TYPE {
  AVATARS = 'avatars',
  COVERS = 'covers',
}

const routes = (type: IMAGE_TYPE): string => {
  switch (type) {
    case IMAGE_TYPE.AVATARS:
      return 'images/avatars';
    default:
      throw new NotAcceptableException();
  }
};

type uriProps = {
  url: string | undefined;
  route: string;
  filename: string;
};

@Entity('images')
export class ImageEntity extends BaseEntity {
  @Exclude()
  @Column()
  public readonly filename!: string;

  @ApiProperty()
  @Column()
  public readonly type!: IMAGE_TYPE;

  @ApiProperty()
  public uri!: string | null;

  @AfterLoad()
  updateUri() {
    const compile = HandlebarsPlugin.compile;
    this.uri = compile<uriProps>({
      template: '{{ url }}/{{ route }}/{{ filename }}',
      data: {
        url: process.env.AWS_S3_URL,
        route: routes(this.type),
        filename: this.filename,
      },
    });
  }
}
