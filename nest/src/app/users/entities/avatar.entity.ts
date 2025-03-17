import { ApiProperty } from '@nestjs/swagger';
import { AfterLoad, Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from 'src/library/data/entities/base.entity';
import { ProfileEntity } from './profile.entity';
import { HandlebarsPlugin } from 'src/plugins/handlebars.plugin';
import { Exclude } from 'class-transformer';
import { STORAGE } from 'src/library/data/enums/files.enum';

type uriProps = {
  url: string | undefined;
  filename: string;
};

@Entity()
export class AvatarEntity extends BaseEntity {
  @Exclude()
  @Column()
  public readonly filename!: string;

  @ApiProperty()
  public uri!: string | null;

  @OneToOne(() => ProfileEntity, (profile: ProfileEntity) => profile.avatar, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public readonly profile!: ProfileEntity;

  @AfterLoad()
  updateUri() {
    const compile = HandlebarsPlugin.compile;
    this.uri = compile<uriProps>({
      template: '{{ url }}/{{ filename }}',
      data: {
        url: process.env.AWS_S3_URL,
        filename: STORAGE.AVATARS + this.filename,
      },
    });
  }
}
