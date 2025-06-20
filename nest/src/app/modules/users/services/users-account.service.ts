import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserEntity } from 'src/app/modules/users/entities/user.entity';
import { TokenManager } from 'src/app/common/utilities/token.utility';
import { UserService } from './users.service';

import * as bcrypt from 'bcrypt';
import { JWTDto } from 'src/library/dto/jwt.dto';
import { Payload } from 'src/library/interfaces/payload.interface';
import { JWTInterface } from 'src/library/interfaces/jwt.interface';

@Injectable()
export class UserAccountService {
  private tokenManager: TokenManager;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    this.tokenManager = new TokenManager(jwtService);
  }

  public createHash(refreshToken: string): string {
    return this.tokenManager.createHash(refreshToken);
  }

  public async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
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

  public async updateRefreshToken(userId: string, refreshToken: string) {
    const hashed = this.createHash(refreshToken);
    await this.userService.update(userId, { refreshToken: hashed });
  }

  public async getTokens(payload: Payload): Promise<JWTInterface> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.JWT_EXPIRY_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_SECRET_KEY,
        expiresIn: process.env.REFRESH_EXPIRY_TIME,
      }),
    ]);

    return { access_token, refresh_token };
  }

  public async issueTokens(user: UserEntity): Promise<JWTDto> {
    const payload: Payload = { email: user.email, sub: user.id };
    const tokens = await this.getTokens(payload);

    await this.updateRefreshToken(user.id, tokens.refresh_token);

    const decoded = this.tokenManager.decode(tokens.refresh_token);

    return new JWTDto({
      token: tokens.refresh_token,
      iat: decoded.iat,
      exp: decoded.exp,
      user,
    });
  }
}
