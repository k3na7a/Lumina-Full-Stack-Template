import { ApiProperty } from '@nestjs/swagger';

import { UserEntity } from 'src/app/modules/users/entities/user.entity';
import { tokenParams } from 'src/library/interfaces/jwt.interface';

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
