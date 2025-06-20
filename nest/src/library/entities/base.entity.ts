import { ApiProperty } from '@nestjs/swagger';
import { nanoid } from 'src/plugins/nanoid.plugin';
import {
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';

export abstract class BaseEntity {
  @ApiProperty({
    description: 'Unique identifier for the entity',
    example: 'aEezoHJV2NHdzBFPkFq0S',
  })
  @PrimaryColumn()
  public id!: string;

  @ApiProperty({
    description: 'Timestamp of when the entity was created',
    example: '1970-01-01T00:00:00.000Z',
    readOnly: true,
  })
  @CreateDateColumn()
  public readonly createdAt!: Date;

  @ApiProperty({
    description: 'Timestamp of when the entity was last updated',
    example: '1970-01-01T00:00:00.000Z',
    readOnly: true,
  })
  @UpdateDateColumn()
  public readonly updatedAt!: Date;

  @BeforeInsert()
  async generateId(): Promise<void> {
    if (!this.id) this.id = nanoid();
  }
}
