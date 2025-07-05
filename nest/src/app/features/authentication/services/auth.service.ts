import { Injectable, UnauthorizedException } from '@nestjs/common';
import { timingSafeEqual } from 'node:crypto';
import { JwtService } from '@nestjs/jwt';

import {
  subject as ForgotPasswordEmailSubject,
  template as ForgotPasswordEmailBody,
  options as ForgotPasswordOptions,
} from 'src/app/queues/email/templates/forgot-password.template';
import { Payload } from 'src/library/interfaces/payload.interface';
import { ForgotPasswordDto } from 'src/app/features/authentication/dto/forgotPassword.dto';
import { JWTDto } from 'src/library/dto/jwt.dto';
import { RegisterDto } from 'src/app/features/authentication/dto/register.dto';

import { SendGridPlugin } from 'src/plugins/sendgrid.plugin';
import { HandlebarsPlugin } from 'src/plugins/handlebars.plugin';

import { UserEntity } from 'src/app/modules/users/entities/user.entity';
import { UserService } from 'src/app/modules/users/services/users.service';
import { UserAccountService } from 'src/app/modules/users/services/users-account.service';
import { JWTInterface } from 'src/library/interfaces/jwt.interface';
import { TokenManager } from 'src/app/common/utilities/token.utility';

@Injectable()
export class AuthService {
  private tokenManager: TokenManager;

  constructor(
    private readonly userService: UserService,
    private readonly accountService: UserAccountService,
    private readonly jwtService: JwtService,
  ) {
    this.tokenManager = new TokenManager(jwtService);
  }

  public async verify(user: UserEntity): Promise<JWTDto> {
    return this.accountService.issueTokens(user);
  }

  public async register(dto: RegisterDto): Promise<JWTDto> {
    const password = await this.accountService.hashPassword(dto.password);
    const user: UserEntity = await this.userService.create({
      ...dto,
      password,
    });
    return this.accountService.issueTokens(user);
  }

  public async signIn(user: UserEntity): Promise<JWTDto> {
    return this.accountService.issueTokens(user);
  }

  public async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.userService.findOneByEmail(dto.email);

    const payload: Payload = { email: user.email, sub: user.id };

    const tokens: JWTInterface = await this.tokenManager.generateTokens(payload);
    const hash = this.tokenManager.createHMAC(tokens.access_token);

    await this.userService.update(user.id, { resetToken: hash });

    await SendGridPlugin.sendMail({
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
    const hashedToken = this.tokenManager.createHMAC(accessToken)

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

  public async signOut(user: UserEntity): Promise<void> {
    await this.userService.update(user.id, { refreshToken: null });
  }
}
