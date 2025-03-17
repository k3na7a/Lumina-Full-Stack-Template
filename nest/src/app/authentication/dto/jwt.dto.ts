import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/app/users/entities/user.entity';

export interface JWTInterface {
  refresh_token: string;
  access_token: string;
}

interface tokenParams {
  token: string;
  iat: number;
  exp: number;
  user: UserEntity;
}

export interface DecodedJWT {
  email: string;
  sub: string;
  iat: number;
  exp: number;
}

export class JWTDto {
  @ApiProperty() public readonly token: string;
  @ApiProperty() public readonly iat: number;
  @ApiProperty() public readonly exp: number;
  @ApiProperty() public readonly user: UserEntity;

  constructor({ token, iat, exp, user }: tokenParams) {
    this.token = token;
    this.iat = iat;
    this.exp = exp;
    this.user = user;
  }
}
