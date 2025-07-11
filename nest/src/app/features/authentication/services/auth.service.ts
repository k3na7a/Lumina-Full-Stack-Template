import { Injectable, UnauthorizedException } from '@nestjs/common';
import { timingSafeEqual } from 'node:crypto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import {
  subject as ForgotPasswordEmailSubject,
  template as ForgotPasswordEmailBody,
  options as ForgotPasswordOptions,
} from 'src/app/queues/email/templates/forgot-password.template';
import { Payload } from 'src/library/interfaces/payload.interface';
import { ForgotPasswordDto } from 'src/app/features/authentication/dto/forgotPassword.dto';
import { JWTDto } from 'src/library/dto/jwt.dto';
import { RegisterDto } from 'src/app/features/authentication/dto/register.dto';

import { HandlebarsPlugin } from 'src/plugins/handlebars.plugin';

import { UserEntity } from 'src/app/modules/users/entities/user.entity';
import { UserService } from 'src/app/modules/users/services/users.service';
import { UserAccountService } from 'src/app/modules/users/services/users-account.service';
import { JWTInterface } from 'src/library/interfaces/jwt.interface';
import { TokenManager } from 'src/app/common/utilities/token.utility';
import { EmailService } from 'src/app/queues/email/services/email.service';

@Injectable()
export class AuthService {
  private tokenManager: TokenManager;

  constructor(
    private readonly userService: UserService,
    private readonly accountService: UserAccountService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {
    this.tokenManager = new TokenManager(jwtService);
  }

  public async verify(user: UserEntity, res: Response): Promise<JWTDto> {
    return this.accountService.issueTokens(user, res);
  }

  public async register(dto: RegisterDto, res: Response): Promise<JWTDto> {
    const password = await this.accountService.hashPassword(dto.password);
    const user: UserEntity = await this.userService.create({
      ...dto,
      password,
    });
    return this.accountService.issueTokens(user, res);
  }

  public async signIn(user: UserEntity, res: Response): Promise<JWTDto> {
    return this.accountService.issueTokens(user, res);
  }

  public async forgotPassword(
    dto: ForgotPasswordDto,
    res: Response,
  ): Promise<void> {
    const user = await this.userService.findOneByEmail(dto.email);

    await this.accountService.revokeTokens(user, res);

    const payload: Payload = { email: user.email, sub: user.id };
    const tokens: JWTInterface =
      await this.tokenManager.generateTokens(payload);
    const hash = this.tokenManager.createHMAC(tokens.access_token);

    await this.userService.update(user.id, { resetToken: hash });

    await this.emailService.sendEmail({
      to: [user.email],
      subject: ForgotPasswordEmailSubject,
      html: HandlebarsPlugin.compile<ForgotPasswordOptions>({
        template: ForgotPasswordEmailBody,
        data: {
          name: `${user.profile.name.first} ${user.profile.name.last}`,
          email: user.email,
          redirect: `${dto.redirect}/guest/password-reset?${new URLSearchParams({ reset_token: tokens.access_token })}`,
        },
      }),
    });
  }

  public async resetPassword(
    user: UserEntity,
    password: string,
    accessToken: string,
  ): Promise<void> {
    const hashedToken = this.tokenManager.createHMAC(accessToken);

    if (!user.resetToken)
      throw new UnauthorizedException('Reset token not set for user');

    const hashedTokenBuffer = Buffer.from(hashedToken);
    const userResetTokenBuffer = Buffer.from(user.resetToken);

    if (
      hashedTokenBuffer.length !== userResetTokenBuffer.length ||
      !timingSafeEqual(hashedTokenBuffer, userResetTokenBuffer)
    )
      throw new UnauthorizedException('Invalid reset token');

    const hashedPassword = await this.accountService.hashPassword(password);

    await this.userService.update(user.id, {
      password: hashedPassword,
      refreshToken: null,
      resetToken: null,
    });
  }

  public async signOut(user: UserEntity, res: Response): Promise<void> {
    await this.accountService.revokeTokens(user, res);
  }
}
