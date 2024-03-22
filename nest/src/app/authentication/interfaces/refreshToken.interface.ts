import { UserEntity } from 'src/app/models/users/entities/user.entity';

interface user {
  email: string;
  sub: string;
  iat: number;
  exp: number;
  userEntity: UserEntity;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  user: user;
}
