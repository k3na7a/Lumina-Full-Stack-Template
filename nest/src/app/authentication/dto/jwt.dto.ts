import { ApiProperty } from '@nestjs/swagger';

export interface JWTInterface {
  refresh_token: string | null;
  access_token: string | null;
}

export class JWTDto {
  @ApiProperty()
  public readonly timestamp: Date;
  @ApiProperty()
  public readonly token: string | null;

  constructor({ refresh_token }: JWTInterface) {
    this.token = refresh_token;
    this.timestamp = new Date();
  }
}
