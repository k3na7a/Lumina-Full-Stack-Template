import { ApiProperty } from '@nestjs/swagger';
import { nanoid } from 'src/plugins/nanoid.plugin';
import {
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';

export abstract class BaseEntity {
  @ApiProperty()
  @PrimaryColumn()
  public id!: string;

  @BeforeInsert()
  async generateId(): Promise<void> {
    this.id = nanoid();
  }

  @ApiProperty()
  @CreateDateColumn()
  public readonly createdAt!: Date;

  @ApiProperty()
  @UpdateDateColumn()
  public readonly updatedAt!: Date;
}
