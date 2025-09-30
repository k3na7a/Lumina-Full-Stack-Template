import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { UserService } from 'src/modules/users/services/users.service';
import {
  Payload,
  AccessTokenValidationPayload,
} from 'src/common/interfaces/payload.interface';

@Injectable()
class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(private usersService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: Payload,
  ): Promise<AccessTokenValidationPayload> {
    const accessToken = req
      .get('Authorization')
      ?.replace(/^Bearer\s+/i, '')
      ?.trim();
    if (!accessToken) throw new UnauthorizedException('Access token missing');

    const user = await this.usersService.findOneById(payload.sub);
    return { ...payload, accessToken, userEntity: user };
  }
}

export { AccessTokenStrategy };
