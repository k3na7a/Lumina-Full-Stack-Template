import { ApiProperty } from '@nestjs/swagger';

export interface BaseInterface {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class BaseDto {
  @ApiProperty({
    description: 'Unique identifier for the resource',
    example: 'XKE44LoPAo9djcKIcX3e5',
  })
  public id: string;

  @ApiProperty({
    description: 'Date and time when the resource was created',
    example: '2025-07-02T12:34:56.789Z',
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'Date and time when the resource was last updated',
    example: '2025-07-02T15:45:12.345Z',
  })
  public updatedAt: Date;
}
