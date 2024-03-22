// #region @imports
// NODE IMPORTS
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { createHmac } from 'node:crypto';
// PROJECT IMPORTS
import { RegisterDto } from '../dto/register.dto';
import { UserEntity } from '../../models/users/entities/user.entity';
import { UserService } from '../../models/users/services/users.service';
import { Payload } from '../interfaces/payload.interface';
import { JWTInterface, JWTDto } from '../dto/jwt.dto';
// #endregion

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private async getTokens(payload: Payload): Promise<JWTInterface> {
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

  private async refreshTokens(
    id: string,
    token: string | null,
  ): Promise<UserEntity> {
    if (!token) return this.userService.update(id, { refreshToken: null });

    const hmac = createHmac('sha256', process.env.CRYPTO_SECRET || '');
    const hash = hmac.update(token).digest('hex');

    return this.userService.update(id, {
      refreshToken: hash,
    });
  }

  public async validateUser(
    email: string,
    password: string,
  ): Promise<UserEntity> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new UnauthorizedException();

    const isMatch = user ? await bcrypt.compare(password, user.password) : null;

    if (isMatch) return user;
    throw new UnauthorizedException();
  }

  public async register(dto: RegisterDto): Promise<JWTDto> {
    const user: UserEntity = await this.userService.create(dto);
    const payload: Payload = { email: user.email, sub: user.$id };
    const tokens: JWTInterface = await this.getTokens(payload);

    await this.refreshTokens(user.$id, tokens.refresh_token);
    return new JWTDto(tokens);
  }

  public async signIn(user: UserEntity): Promise<JWTDto> {
    const payload: Payload = { email: user.email, sub: user.$id };
    const tokens: JWTInterface = await this.getTokens(payload);

    await this.refreshTokens(user.$id, tokens.refresh_token);
    return new JWTDto(tokens);
  }

  public async signOut(user: UserEntity): Promise<JWTDto> {
    await this.refreshTokens(user.$id, null);
    return new JWTDto({ refresh_token: null, access_token: null });
  }

  public async verifyToken(user: UserEntity): Promise<JWTDto> {
    const payload: Payload = { email: user.email, sub: user.$id };
    const tokens: JWTInterface = await this.getTokens(payload);

    await this.refreshTokens(user.$id, tokens.refresh_token);
    return new JWTDto(tokens);
  }
}
