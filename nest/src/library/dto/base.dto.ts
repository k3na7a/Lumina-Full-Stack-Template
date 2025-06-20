import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseDto {
  @ApiProperty()
  public id: string;
  @ApiProperty()
  public createdAt: Date;
  @ApiProperty()
  public updatedAt: Date;
}
