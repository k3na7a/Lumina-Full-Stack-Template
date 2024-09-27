import { UserEntity } from "../entities/user/user.entity";

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
