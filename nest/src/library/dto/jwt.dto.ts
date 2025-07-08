import { ApiProperty } from '@nestjs/swagger';

import { UserEntity } from 'src/app/modules/users/entities/user.entity';
import { tokenParams } from 'src/library/interfaces/jwt.interface';

export class JWTDto {
  @ApiProperty({
    description: 'The signed JWT access token string.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  public readonly access_token: string;

  @ApiProperty({
    description: 'Issued At timestamp (seconds since Unix epoch).',
    example: 1688209827,
  })
  public readonly iat: number;

  @ApiProperty({
    description: 'Expiration timestamp (seconds since Unix epoch).',
    example: 1688213427,
  })
  public readonly exp: number;

  @ApiProperty({
    description: 'The user entity associated with this token.',
    type: () => UserEntity,
  })
  public readonly user: UserEntity;

  constructor({ access_token, iat, exp, user }: tokenParams) {
    this.access_token = access_token;
    this.iat = iat;
    this.exp = exp;
    this.user = user;
  }
}
