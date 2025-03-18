import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHmac } from 'node:crypto';

import { RegisterDto } from 'src/app/authentication/dto/register.dto';
import { UserService } from 'src/app/users/services/users.service';
import { Payload } from '../interfaces/payload.interface';
import {
  JWTInterface,
  JWTDto,
  DecodedJWT,
} from 'src/app/authentication/dto/jwt.dto';
import { SendGridPlugin } from 'src/plugins/sendgrid.plugin';

import {
  subject as ForgotPasswordEmailSubject,
  template as ForgotPasswordEmailBody,
  options as ForgotPasswordOptions,
} from 'src/library/templates/forgot-password.template';
import { HandlebarsPlugin } from 'src/plugins/handlebars.plugin';
import { updatePasswordDto } from 'src/app/authentication/dto/updatePassword.dto';
import { deleteAccountDto } from 'src/app/authentication/dto/deleteAccount.dto';
import { UpdateUserProfile } from 'src/app/users/interfaces/user.interfaces';
import { ProfileService } from 'src/app/users/services/profile.service';
import { ForgotPasswordDto } from 'src/app/authentication/dto/forgotPassword.dto';
import { AvatarService } from 'src/app/users/services/avatar.service';
import { UserEntity } from 'src/app/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
    private readonly avatarService: AvatarService,
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

  private async refreshTokens(id: string, token: string): Promise<void> {
    const hmac = createHmac('sha256', process.env.CRYPTO_SECRET || '');
    const hash = hmac.update(token).digest('hex');

    await this.userService.update(id, {
      refreshToken: hash,
    });
  }

  private decodeToken(token: string): DecodedJWT {
    return this.jwtService.decode(token) as DecodedJWT;
  }

  public async validateUser(
    email: string,
    password: string,
  ): Promise<UserEntity> {
    const user = await this.userService.findOneByEmail(email);
    const isMatch = user ? await bcrypt.compare(password, user.password) : null;

    if (isMatch) return user;
    throw new UnauthorizedException();
  }

  public async register(dto: RegisterDto): Promise<JWTDto> {
    const user: UserEntity = await this.userService.create(dto);
    return this.verifyToken(user);
  }

  public async signIn(user: UserEntity): Promise<JWTDto> {
    return this.verifyToken(user);
  }

  public async signOut(user: UserEntity): Promise<void> {
    await this.userService.update(user.id, { refreshToken: null });
  }

  public async verifyToken(user: UserEntity): Promise<JWTDto> {
    const payload: Payload = { email: user.email, sub: user.id };
    const tokens: JWTInterface = await this.getTokens(payload);

    const decoded = this.decodeToken(tokens.refresh_token);

    await this.refreshTokens(user.id, tokens.refresh_token);

    return new JWTDto({
      token: tokens.refresh_token,
      iat: decoded.iat,
      exp: decoded.exp,
      user,
    });
  }

  public async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.userService.findOneByEmail(dto.email);

    const payload: Payload = { email: user.email, sub: user.id };
    const tokens: JWTInterface = await this.getTokens(payload);

    const hmac = createHmac('sha256', process.env.CRYPTO_SECRET || '');
    const hash = hmac.update(tokens.access_token).digest('hex');

    await this.userService.update(user.id, { resetToken: hash });

    await SendGridPlugin.sendMail({
      to: [user.email],
      subject: ForgotPasswordEmailSubject,
      html: HandlebarsPlugin.compile<ForgotPasswordOptions>({
        template: ForgotPasswordEmailBody,
        data: {
          name: user.getFullName(),
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
    const hmac = createHmac('sha256', process.env.CRYPTO_SECRET || '');
    const hashval = hmac.update(accessToken).digest('hex');

    if (hashval !== user.resetToken) throw new UnauthorizedException();

    const salt: string = await bcrypt.genSalt();
    const hash: string = await bcrypt.hash(password, salt);

    await this.userService.update(user.id, {
      password: hash,
      refreshToken: null,
      resetToken: null,
    });
  }

  public async updateAvatar(
    { profile, id }: UserEntity,
    file: Express.Multer.File,
  ): Promise<JWTDto> {
    if (profile.avatar)
      await this.avatarService.update(profile.avatar.id, file);
    else {
      const avatar = await this.avatarService.create(file);
      await this.profileService.update(profile.id, { avatar });
    }

    const new_user = await this.userService.findOneById(id);
    return this.verifyToken(new_user);
  }

  public async removeAvatar({ profile, id }: UserEntity) {
    if (!profile.avatar) throw new NotFoundException();

    await this.avatarService.remove(profile.avatar.id);

    const new_user = await this.userService.findOneById(id);
    return this.verifyToken(new_user);
  }

  public async updateEmail(
    user: UserEntity,
    { password, new_email }: { password: string; new_email: string },
  ): Promise<JWTDto> {
    await this.validateUser(user.email, password);

    const new_user = await this.userService.update(user.id, {
      email: new_email,
    });

    return this.verifyToken(new_user);
  }

  public async updateProfile(
    user: UserEntity,
    profile: UpdateUserProfile,
  ): Promise<JWTDto> {
    await this.profileService.update(user.profile.id, profile);

    const new_user = await this.userService.findOneById(user.id);
    return this.verifyToken(new_user);
  }

  public async updatePassword(
    user: UserEntity,
    { old_password, new_password }: updatePasswordDto,
  ): Promise<JWTDto> {
    await this.validateUser(user.email, old_password);

    const salt: string = await bcrypt.genSalt();
    const hash: string = await bcrypt.hash(new_password, salt);

    const new_user = await this.userService.update(user.id, {
      password: hash,
    });

    return this.verifyToken(new_user);
  }

  public async deleteAccount(
    user: UserEntity,
    { password }: deleteAccountDto,
  ): Promise<void> {
    await this.validateUser(user.email, password);
    await this.userService.remove(user.id);
  }
}
