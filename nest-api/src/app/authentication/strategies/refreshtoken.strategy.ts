import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { Request } from 'express';
import * as bcrypt from 'bcrypt';

import { UserService } from 'src/app/models/users/users.service';
import { Payload } from '../interfaces/payload.interface';

@Injectable()
class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private usersService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.RefreshTokenSecretKey,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: Payload) {
    const refreshToken = req.get('Authorization')?.replace('Bearer', '').trim();
    const user = await this.usersService.findOneByEmail(payload.email);

    console.log(payload);

    if (!user || !user.refreshToken || !refreshToken)
      throw new UnauthorizedException();

    const isMatch: boolean = user
      ? await bcrypt.compare(refreshToken, user.refreshToken)
      : false;

    if (!isMatch) throw new UnauthorizedException();

    return { ...payload, user, refreshToken };
  }
}

export { RefreshTokenStrategy };
