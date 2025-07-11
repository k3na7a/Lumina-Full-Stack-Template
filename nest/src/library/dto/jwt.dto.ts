import { ApiProperty } from '@nestjs/swagger';

import { UserEntity } from 'src/app/modules/users/entities/user.entity';
import { tokenParams } from 'src/library/interfaces/jwt.interface';

export class JWTDto {
  @ApiProperty({
    description:
      'Expiration timestamp for refresh cookie (seconds since Unix epoch).',
    example: 1688213427,
  })
  public readonly refresh: number;

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

  constructor({ access_token, iat, exp, user, refresh }: tokenParams) {
    this.refresh = refresh;
    this.access_token = access_token;
    this.iat = iat;
    this.exp = exp;
    this.user = user;
  }
}

export class CsrfDto {
  @ApiProperty({
    description: 'The signed csrf token string.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  public readonly token: string;

  @ApiProperty({
    description: 'Issued At timestamp. (Epoch Unix Timestamp)',
    example: 1751977200,
  })
  public readonly iat: number;

  @ApiProperty({
    description: 'Expiration timestamp. (Epoch Unix Timestamp)',
    example: 1751977200,
  })
  public readonly exp: number;

  constructor({ token, iat, exp }: any) {
    this.token = token;
    this.iat = iat;
    this.exp = exp;
  }
}
