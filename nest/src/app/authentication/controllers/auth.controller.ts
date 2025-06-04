import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AuthService } from '../services/auth.service';

import { storage } from 'src/library/config/storage.config';
import {
  RegisterDto,
  RegisterProfileDto,
} from 'src/app/authentication/dto/register.dto';
import { JWTDto } from 'src/app/authentication/dto/jwt.dto';
import { SignInDto } from 'src/app/authentication/dto/signIn.dto';
import { LocalAuthGuard } from '../guards/localAuth.guard';
import { ForgotPasswordDto } from 'src/app/authentication/dto/forgotPassword.dto';
import { AccessTokenGuard } from '../guards/accesstoken.guard';
import { ResetPasswordDto } from 'src/app/authentication/dto/resetPassword.dto';
import { updatePasswordDto } from 'src/app/authentication/dto/updatePassword.dto';
import { updateEmailDto } from 'src/app/authentication/dto/updateEmail.dto';
import { deleteAccountDto } from 'src/app/authentication/dto/deleteAccount.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { megabyte } from 'src/library/data/constants/size.constants';
import { UserEntity } from 'src/app/users/entities/user.entity';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Authenticated } from '../decorators/authenticated.decorator';

@ApiTags('Authentication / Self Management')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Put('/register')
  @ApiBody({ type: RegisterDto })
  @ApiOkResponse({ type: JWTDto })
  async register(@Body() dto: RegisterDto): Promise<JWTDto> {
    return this.authService.register(dto);
  }

  @Post('/verify-token')
  @ApiBearerAuth('access-token')
  @Authenticated()
  async verifyToken(@CurrentUser() user: UserEntity): Promise<JWTDto> {
    return this.authService.issueTokens(user);
  }

  @Post('/sign-in')
  @ApiBody({ type: SignInDto })
  @ApiOkResponse({ type: JWTDto })
  @UseGuards(LocalAuthGuard)
  async signIn(@CurrentUser() user: UserEntity): Promise<JWTDto> {
    return this.authService.signIn(user);
  }

  @Post('/sign-out')
  @Authenticated()
  async signOut(@CurrentUser() user: UserEntity): Promise<void> {
    await this.authService.signOut(user);
  }

  @Post('/forgot-password')
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<void> {
    await this.authService.forgotPassword(dto);
  }

  @Patch('/reset-password')
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard)
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(
    @CurrentUser() user: UserEntity,
    @Request() { accessToken }: { accessToken: string },
    @Body('confirm_password') confirm_password: string,
  ): Promise<void> {
    await this.authService.resetPassword(user, confirm_password, accessToken);
  }

  @Patch('/update-profile')
  @Authenticated()
  @ApiBody({ type: RegisterProfileDto })
  @ApiOkResponse({ type: JWTDto })
  async updateProfile(
    @CurrentUser() user: UserEntity,
    @Body() dto: RegisterProfileDto,
  ): Promise<JWTDto> {
    return this.authService.updateProfile(user, dto);
  }

  @Patch('/update-email')
  @Authenticated()
  @ApiBody({ type: updateEmailDto })
  @ApiOkResponse({ type: JWTDto })
  async updateEmail(
    @CurrentUser() user: UserEntity,
    @Body() dto: updateEmailDto,
  ): Promise<JWTDto> {
    return this.authService.updateEmail(user, dto);
  }

  @Patch('/update-password')
  @Authenticated()
  @ApiBody({ type: updatePasswordDto })
  @ApiOkResponse({ type: JWTDto })
  async updatePassword(
    @CurrentUser() user: UserEntity,
    @Body() dto: updatePasswordDto,
  ): Promise<JWTDto> {
    return this.authService.updatePassword(user, dto);
  }

  @Patch('/update-avatar')
  @Authenticated()
  @ApiOkResponse({ type: JWTDto })
  @UseInterceptors(FileInterceptor('avatar', { storage }))
  async updateAvatar(
    @CurrentUser() user: UserEntity,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 10 * megabyte,
          }),
          new FileTypeValidator({
            fileType: '.(png|jpeg|jpg|gif)',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<JWTDto> {
    return this.authService.updateAvatar(user, file);
  }

  @Delete('/remove-avatar')
  @Authenticated()
  @ApiOkResponse({ type: JWTDto })
  async removeAvatar(@CurrentUser() user: UserEntity): Promise<JWTDto> {
    return this.authService.removeAvatar(user);
  }

  @Delete('/delete-account')
  @Authenticated()
  @ApiBody({ type: deleteAccountDto })
  async deleteAccount(
    @CurrentUser() user: UserEntity,
    @Body() dto: deleteAccountDto,
  ): Promise<void> {
    await this.authService.deleteAccount(user, dto);
  }
}
