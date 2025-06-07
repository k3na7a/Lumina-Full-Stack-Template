import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { timingSafeEqual } from 'node:crypto';

import { RegisterDto } from 'src/app/authentication/dto/register.dto';
import { UserService } from 'src/app/users/services/users.service';
import { Payload } from '../interfaces/payload.interface';
import { JWTInterface, JWTDto } from 'src/app/authentication/dto/jwt.dto';
import { SendGridPlugin } from 'src/plugins/sendgrid.plugin';

import {
  subject as ForgotPasswordEmailSubject,
  template as ForgotPasswordEmailBody,
  options as ForgotPasswordOptions,
} from 'src/library/templates/forgot-password.template';

import { HandlebarsPlugin } from 'src/plugins/handlebars.plugin';
import { ForgotPasswordDto } from 'src/app/authentication/dto/forgotPassword.dto';
import { UserEntity } from 'src/app/users/entities/user.entity';
import { ProfileService } from 'src/app/users/services/profile.service';
import { UpdateUserProfile } from 'src/app/users/interfaces/user.interfaces';
import { TokenManager } from 'src/library/utilities/token.utility';
import { updatePasswordDto } from '../dto/updatePassword.dto';
import { deleteAccountDto } from '../dto/deleteAccount.dto';

@Injectable()
export class AuthService {
  private tokenManager: TokenManager;

  constructor(
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
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

  public createHash(refreshToken: string): string {
    return this.tokenManager.createHash(refreshToken);
  }

  public async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  public async updateRefreshToken(userId: string, refreshToken: string) {
    const hashed = this.createHash(refreshToken);
    await this.userService.update(userId, { refreshToken: hashed });
  }

  public async register(dto: RegisterDto): Promise<JWTDto> {
    const user: UserEntity = await this.userService.create(dto);
    return this.issueTokens(user);
  }

  public async signIn(user: UserEntity): Promise<JWTDto> {
    return this.issueTokens(user);
  }

  private async sendForgotPasswordEmail(
    user: UserEntity,
    resetToken: string,
    redirectUrl: string,
  ): Promise<void> {
    return SendGridPlugin.sendMail({
      to: [user.email],
      subject: ForgotPasswordEmailSubject,
      html: HandlebarsPlugin.compile<ForgotPasswordOptions>({
        template: ForgotPasswordEmailBody,
        data: {
          name: user.getFullName(),
          email: user.email,
          redirect: `${redirectUrl}/guest/password-reset?${new URLSearchParams({ reset_token: resetToken })}`,
        },
      }),
    });
  }

  public async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.userService.findOneByEmail(dto.email);

    const payload: Payload = { email: user.email, sub: user.id };
    const tokens: JWTInterface = await this.getTokens(payload);

    const hashedResetToken = this.createHash(tokens.access_token);
    await this.userService.update(user.id, { resetToken: hashedResetToken });

    await this.sendForgotPasswordEmail(user, tokens.access_token, dto.redirect);
  }

  public async resetPassword(
    user: UserEntity,
    password: string,
    accessToken: string,
  ): Promise<void> {
    const hashedToken = this.createHash(accessToken);

    if (!user.resetToken)
      throw new UnauthorizedException('Reset token not set for user');

    const hashedTokenBuffer = Buffer.from(hashedToken);
    const userResetTokenBuffer = Buffer.from(user.resetToken);

    if (
      hashedTokenBuffer.length !== userResetTokenBuffer.length ||
      !timingSafeEqual(hashedTokenBuffer, userResetTokenBuffer)
    )
      throw new UnauthorizedException('Invalid reset token');

    const hashedPassword = await this.hashPassword(password);

    await this.userService.update(user.id, {
      password: hashedPassword,
      refreshToken: null,
      resetToken: null,
    });
  }

  public async signOut(user: UserEntity): Promise<void> {
    await this.userService.update(user.id, { refreshToken: null });
  }

  public async updateEmail(
    user: UserEntity,
    { password, new_email }: { password: string; new_email: string },
  ): Promise<JWTDto> {
    await this.validateUser(user.email, password);

    const updatedUser = await this.userService.update(user.id, {
      email: new_email,
    });

    return this.issueTokens(updatedUser);
  }

  public async updatePassword(
    user: UserEntity,
    { old_password, new_password }: updatePasswordDto,
  ): Promise<JWTDto> {
    await this.validateUser(user.email, old_password);

    const hashedPassword = await this.hashPassword(new_password);
    const updatedUser = await this.userService.update(user.id, {
      password: hashedPassword,
    });

    return this.issueTokens(updatedUser);
  }

  public async deleteAccount(
    user: UserEntity,
    { password }: deleteAccountDto,
  ): Promise<void> {
    await this.validateUser(user.email, password);
    await this.userService.remove(user.id);
  }

  public async updateProfile(
    user: UserEntity,
    profile: UpdateUserProfile,
  ): Promise<JWTDto> {
    await this.profileService.update(user.profile, profile);

    const updatedUser = await this.userService.findOneById(user.id);
    return this.issueTokens(updatedUser);
  }

  public async updateAvatar(
    user: UserEntity,
    file: Express.Multer.File,
  ): Promise<JWTDto> {
    await this.profileService.handleAvatarUpload(user.profile, file);

    const updatedUser = await this.userService.findOneById(user.id);
    return this.issueTokens(updatedUser);
  }

  public async removeAvatar(user: UserEntity) {
    await this.profileService.removeAvatar(user.profile);

    const updatedUser = await this.userService.findOneById(user.id);
    return this.issueTokens(updatedUser);
  }
}
