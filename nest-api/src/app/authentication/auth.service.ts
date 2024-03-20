// #region @imports
// NODE IMPORTS
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
// PROJECT IMPORTS
import { RegisterDto } from './dto/register.dto';
import { UserEntity } from '../models/users/entities/user.entity';
import { UserService } from '../models/users/users.service';
import { Payload } from './interfaces/payload.interface';
import { JWTInterface, JWTDto } from './dto/jwt.dto';
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
        secret: process.env.jwtSecretKey,
        expiresIn: process.env.jwtExpiryTime,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.refreshTokenSecretKey,
        expiresIn: process.env.refreshTokenExpiryTime,
      }),
    ]);

    return { access_token, refresh_token };
  }

  private async refreshTokens(id: string, token: string): Promise<UserEntity> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(token, salt);

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
}
