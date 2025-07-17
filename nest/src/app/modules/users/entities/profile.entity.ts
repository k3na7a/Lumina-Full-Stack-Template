import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Entity, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/app/common/entities/base.entity';
import { ImageEntity } from 'src/app/modules/media/entities/image.entity';
import { UserEntity } from 'src/app/modules/users/entities/user.entity';

class Name {
  @ApiProperty({
    description: "User's first name",
    example: 'Jane',
  })
  @Column()
  public readonly first!: string;

  @ApiProperty({
    description: "User's last name",
    example: 'Doe',
  })
  @Column()
  public readonly last!: string;
}

@Entity('user_profiles')
export class ProfileEntity extends BaseEntity {
  @ApiPropertyOptional({ type: () => ImageEntity })
  @ManyToOne(() => ImageEntity, {
    cascade: ['insert', 'update'],
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn([{ name: 'image_id', referencedColumnName: 'id' }])
  public readonly avatar?: ImageEntity | null;

  @ApiProperty({ type: Name })
  @Column(() => Name)
  public readonly name!: Name;

  @OneToOne(() => UserEntity, (user: UserEntity) => user.profile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public readonly user!: UserEntity;
}
