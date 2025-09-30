import { Injectable, UnauthorizedException } from '@nestjs/common';
import { timingSafeEqual } from 'node:crypto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import {
  subject as ForgotPasswordEmailSubject,
  template as ForgotPasswordEmailBody,
  options as ForgotPasswordOptions,
} from 'src/queues/email/templates/forgot-password.template';
import { Payload } from 'src/common/interfaces/payload.interface';
import { ForgotPasswordDto } from 'src/features/authentication/dto/forgotPassword.dto';
import { JWTDto } from 'src/common/dto/jwt.dto';
import { RegisterDto } from 'src/features/authentication/dto/register.dto';

import { HandlebarsPlugin } from 'src/plugins/handlebars.plugin';

import { UserEntity } from 'src/modules/users/entities/user.entity';
import { UserService } from 'src/modules/users/services/users.service';
import { UserAccountService } from 'src/modules/users/services/users-account.service';
import { JWTInterface } from 'src/common/interfaces/jwt.interface';
import { TokenManager } from 'src/common/utilities/token.utility';
import { EmailService } from 'src/queues/email/services/email.service';
import {
  buildAuditSnapshotsAndDiff,
  redactHeaders,
} from '@lib/utilities/object.util';
import { AuditEntity } from 'src/modules/audit/entities/audit.entity';
import { iaudit } from 'src/modules/audit/dto/audit.dto';
import {
  Action,
  ActorType,
  Domain,
  SourceType,
  SUB_DOMAIN,
} from '@lib/dto/audit.dto';
import { AuditService } from 'src/modules/audit/service/audit.service';
import { instanceToPlain } from 'class-transformer';
import { RequestContext } from 'src/common/providers/request-context.provider';

@Injectable()
export class AuthService {
  private tokenManager: TokenManager;

  constructor(
    private readonly userService: UserService,
    private readonly accountService: UserAccountService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly auditService: AuditService,
    private readonly requestContext: RequestContext,
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

    await this.audit(
      {
        action: Action.CREATE,
        entityId: user.id,
        entityDisplay: user.email,
        before: instanceToPlain({}),
        after: instanceToPlain(user),
        reason: 'Account created by guest during registration.',
      },
      ActorType.GUEST,
    );

    return this.accountService.issueTokens(user, res);
  }

  public async signIn(user: UserEntity, res: Response): Promise<JWTDto> {
    return this.accountService.issueTokens(user, res);
  }

  public async signOut(user: UserEntity, res: Response): Promise<void> {
    await this.accountService.revokeTokens(user, res);
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

    const hashedTokenBuffer = Buffer.from(hashedToken) as unknown as Uint8Array;
    const userResetTokenBuffer = Buffer.from(
      user.resetToken,
    ) as unknown as Uint8Array;

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

    const updatedUser = await this.userService.findOneById(user.id);

    await this.audit({
      action: Action.UPDATE,
      entityId: updatedUser.id,
      entityDisplay: updatedUser.email,
      before: instanceToPlain(user),
      after: instanceToPlain(updatedUser),
      reason: 'Password reset by account owner using reset token.',
    });
  }

  private async audit(
    payload: iaudit,
    actorType: ActorType = ActorType.USER,
  ): Promise<AuditEntity> {
    const { diff, beforeRedacted, afterRedacted } = buildAuditSnapshotsAndDiff(
      payload.before,
      payload.after,
      ['password', 'refreshToken', 'resetToken'],
      ['roles'],
    );

    const { request } = this.requestContext.getStore() ?? {};
    const { url, method, headers } = request ?? {};

    return this.auditService.create({
      ...payload,
      actorType,
      source: SourceType.WEB,
      domain: Domain.USER_MANAGEMENT,
      subDomain: SUB_DOMAIN.USER,
      before: beforeRedacted,
      after: afterRedacted,
      diff: diff,
      metadata: {
        path: url,
        method,
        headers: headers ? redactHeaders(headers) : undefined,
      },
    });
  }
}
