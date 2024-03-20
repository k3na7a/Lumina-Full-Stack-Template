import { ApiProperty } from '@nestjs/swagger';

export interface BaseInterface {
  $id: string;
  $createdAt: Date;
  $updatedAt: Date;
}

export abstract class BaseDto {
  @ApiProperty()
  public $id: string;
  @ApiProperty()
  public $createdAt: Date;
  @ApiProperty()
  public $updatedAt: Date;
}
