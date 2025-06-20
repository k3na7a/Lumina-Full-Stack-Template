import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { createHmac } from 'crypto';

import { UserService } from 'src/app/modules/users/services/users.service';
import { UserEntity } from 'src/app/modules/users/entities/user.entity';

import { Payload } from 'src/library/interfaces/payload.interface';

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
