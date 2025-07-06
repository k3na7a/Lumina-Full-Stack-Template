import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserEntity } from 'src/app/modules/users/entities/user.entity';
import { TokenManager } from 'src/app/common/utilities/token.utility';
import { UserService } from './users.service';

import * as bcrypt from 'bcrypt';
import { JWTDto } from 'src/library/dto/jwt.dto';
import { Payload } from 'src/library/interfaces/payload.interface';

@Injectable()
export class UserAccountService {
  private tokenManager: TokenManager;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    this.tokenManager = new TokenManager(jwtService);
  }

  public async validateUser(
    email: string,
    password: string,
  ): Promise<UserEntity> {
    const user = await this.userService.findOneByEmail(email);
    const isMatch = user ? await bcrypt.compare(password, user.password) : null;

    if (isMatch) return user;
    throw new UnauthorizedException('Invalid credentials');
  }

  public async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  public async issueTokens(user: UserEntity): Promise<JWTDto> {
    const payload: Payload = { email: user.email, sub: user.id };
    const tokens = await this.tokenManager.generateTokens(payload);

    const hashed = this.tokenManager.createHMAC(tokens.refresh_token);
    await this.userService.update(user.id, { refreshToken: hashed });

    const decoded = this.tokenManager.decode(tokens.access_token);

    return new JWTDto({
      refresh_token: tokens.refresh_token,
      access_token: tokens.access_token,
      iat: decoded.iat,
      exp: decoded.exp,
      user,
    });
  }
}
