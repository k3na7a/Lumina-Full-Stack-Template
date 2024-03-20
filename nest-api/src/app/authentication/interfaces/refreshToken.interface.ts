import { UserEntity } from 'src/app/models/users/entities/user.entity';

export interface RefreshTokenRequest {
  email: string;
  sub: string;
  iat: number;
  exp: number;
  user: UserEntity;
  refreshToken: string;
}
