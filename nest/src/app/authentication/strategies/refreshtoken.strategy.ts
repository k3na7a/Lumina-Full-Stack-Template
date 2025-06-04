import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { Request } from 'express';

import { UserService } from 'src/app/users/services/users.service';
import { createHmac } from 'node:crypto';
import { Payload } from 'src/app/authentication/interfaces/payload.interface';
import { UserEntity } from 'src/app/users/entities/user.entity';

@Injectable()
class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly usersService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.REFRESH_SECRET_KEY,
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: Payload,
  ): Promise<{
    userEntity: UserEntity;
    refreshToken: string;
    email: string;
    sub: string;
  }> {
    const refreshToken = req
      .get('Authorization')
      ?.replace(/^Bearer\s+/i, '')
      ?.trim();

    if (!refreshToken) throw new UnauthorizedException('Refresh token missing');

    const user = await this.usersService.findOneByEmail(payload.email);
    if (!user.refreshToken)
      throw new UnauthorizedException('No refresh token stored');

    const hmac = createHmac('sha256', process.env.CRYPTO_SECRET || '');
    const hash = hmac.update(refreshToken).digest('hex');

    if (hash !== user.refreshToken)
      throw new UnauthorizedException('Invalid refresh token');
    return { ...payload, userEntity: user, refreshToken };
  }
}

export { RefreshTokenStrategy };
