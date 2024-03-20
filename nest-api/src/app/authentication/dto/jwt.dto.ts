import { ApiProperty } from '@nestjs/swagger';

export interface JWTInterface {
  refresh_token: string;
  access_token: string;
}

export class JWTDto {
  @ApiProperty()
  public timestamp: Date;
  @ApiProperty()
  public token: string;

  constructor({ refresh_token }: JWTInterface) {
    this.token = refresh_token;
    this.timestamp = new Date();
  }
}
