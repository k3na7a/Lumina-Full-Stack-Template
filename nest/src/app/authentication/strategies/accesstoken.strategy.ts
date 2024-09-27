import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { UserService } from 'src/app/modules/users/services/users.service';
import {
  AccessTokenValidationPayload,
  Payload,
} from 'src/library/interfaces/payload.interface';

@Injectable()
class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
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
    const accessToken = req.get('Authorization')?.replace('Bearer', '').trim();
    if (!accessToken) throw new UnauthorizedException();

    const user = await this.usersService.findOneById(payload.sub);
    return { ...payload, accessToken, userEntity: user };
  }
}

export { AccessTokenStrategy };
