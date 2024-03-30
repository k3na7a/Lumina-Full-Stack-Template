import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { UserEntity } from 'src/app/models/users/entities/user.entity';
import { UserService } from 'src/app/models/users/services/users.service';
import { Payload } from '../interfaces/payload.interface';

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
  ): Promise<{
    accessToken: string;
    userEntity: UserEntity;
    email: string;
    sub: string;
  }> {
    const accessToken = req.get('Authorization')?.replace('Bearer', '').trim();
    if (!accessToken) throw new UnauthorizedException();

    const user = await this.usersService.findOneById(payload.sub);
    if (!user) throw new UnauthorizedException();

    return { ...payload, accessToken, userEntity: user };
  }
}

export { AccessTokenStrategy };
