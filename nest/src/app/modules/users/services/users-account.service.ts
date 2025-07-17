import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserEntity } from 'src/app/modules/users/entities/user.entity';
import { TokenManager } from 'src/app/common/utilities/token.utility';
import { UserService } from './users.service';

import { Response } from 'express';
import * as bcrypt from 'bcrypt';

import { JWTDto } from 'src/app/common/dto/jwt.dto';
import { Payload } from 'src/app/common/interfaces/payload.interface';
import { day } from '@lib/constants/time.constants';
import { PermissionsKey } from '@lib/constants/permissions.constants';
import { RoleEntity } from '../entities/role.entity';

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

  public async hasPermission(
    { roles }: UserEntity,
    keys: PermissionsKey[],
  ): Promise<void> {
    const userPermissions = Array.from(
      new Set(
        roles?.flatMap((val: RoleEntity) =>
          val.permissions?.map((permission) => permission.name),
        ),
      ),
    );

    const hasPermission = keys.some((permission: string) =>
      userPermissions.includes(permission),
    );

    if (!hasPermission)
      throw new UnauthorizedException('User does not have required permission');
  }

  public async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  public async revokeTokens(user: UserEntity, res: Response): Promise<void> {
    await this.userService.update(user.id, { refreshToken: null });
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: false,
      path: '/',
    });
  }

  public async issueTokens(user: UserEntity, res: Response): Promise<JWTDto> {
    const payload: Payload = { email: user.email, sub: user.id };
    const tokens = await this.tokenManager.generateTokens(payload);

    const hashed = this.tokenManager.createHMAC(tokens.refresh_token);
    await this.userService.update(user.id, { refreshToken: hashed });

    const decoded = this.tokenManager.decode(tokens.access_token);
    const refresh = this.tokenManager.decode(tokens.refresh_token);

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      path: '/',
      maxAge: 7 * day,
    });

    return new JWTDto({
      refresh: refresh.exp,
      access_token: tokens.access_token,
      iat: decoded.iat,
      exp: decoded.exp,
      user,
    });
  }
}
