import { ApiProperty } from '@nestjs/swagger';
import { AfterLoad, Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from 'src/library/entities/base.entity';
import { ProfileEntity } from './profile.entity';
import { HandlebarsPlugin } from 'src/plugins/handlebars.plugin';
import { STORAGE } from 'src/library/enums/files.enum';
import { Exclude } from 'class-transformer';

type uriProps = {
  url: string | undefined;
  dir: string;
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
      template: '{{ url }}/{{ dir }}/{{ filename }}',
      data: {
        url: process.env.BASE_URL,
        dir: STORAGE.AVATARS,
        filename: this.filename,
      },
    });
  }
}
