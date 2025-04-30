import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/library/data/entities/base.entity';
import { Entity, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { ImageEntity } from 'src/app/media/entities/image.entity';

class Name {
  @ApiProperty()
  @Column()
  public readonly first!: string;
  @ApiProperty()
  @Column()
  public readonly last!: string;
}

@Entity('profiles')
export class ProfileEntity extends BaseEntity {
  @ApiProperty({ type: () => ImageEntity })
  @ManyToOne(() => ImageEntity, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  @JoinColumn([{ name: 'image_id', referencedColumnName: 'id' }])
  public readonly avatar!: ImageEntity | null;

  @ApiProperty({ type: Name })
  @Column(() => Name)
  public readonly name!: Name;

  @OneToOne(() => UserEntity, (user: UserEntity) => user.profile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public readonly user!: UserEntity;
}
