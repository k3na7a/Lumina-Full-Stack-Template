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
import { RefreshTokenGuard } from '../guards/refreshtoken.guard';
import { RefreshTokenRequest } from 'src/app/authentication/interfaces/refreshToken.interface';
import { ForgotPasswordDto } from 'src/app/authentication/dto/forgotPassword.dto';
import { AccessTokenGuard } from '../guards/accesstoken.guard';
import { AccessTokenRequest } from 'src/app/authentication/interfaces/accessToken.interface';
import { ResetPasswordDto } from 'src/app/authentication/dto/resetPassword.dto';
import { updatePasswordDto } from 'src/app/authentication/dto/updatePassword.dto';
import { updateEmailDto } from 'src/app/authentication/dto/updateEmail.dto';
import { deleteAccountDto } from 'src/app/authentication/dto/deleteAccount.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { megabyte } from 'src/library/constants/size.constants';
import { UserEntity } from 'src/app/modules/users/entities/user.entity';

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
  @UseGuards(RefreshTokenGuard)
  @ApiOkResponse({ type: JWTDto })
  async verifyToken(@Request() { user }: RefreshTokenRequest): Promise<JWTDto> {
    return this.authService.verifyToken(user.userEntity);
  }

  @Post('/sign-in')
  @ApiBody({ type: SignInDto })
  @ApiOkResponse({ type: JWTDto })
  @UseGuards(LocalAuthGuard)
  async signIn(@Request() { user }: { user: UserEntity }): Promise<JWTDto> {
    return this.authService.signIn(user);
  }

  @Post('/sign-out')
  @ApiBearerAuth('access-token')
  @UseGuards(RefreshTokenGuard)
  async signOut(@Request() { user }: RefreshTokenRequest): Promise<void> {
    await this.authService.signOut(user.userEntity);
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
    @Request() { user }: AccessTokenRequest,
    @Body() { confirm_password }: ResetPasswordDto,
  ): Promise<void> {
    await this.authService.resetPassword(
      user.userEntity,
      confirm_password,
      user.accessToken,
    );
  }

  @Patch('/update-profile')
  @ApiBearerAuth('access-token')
  @UseGuards(RefreshTokenGuard)
  @ApiBody({ type: RegisterProfileDto })
  @ApiOkResponse({ type: JWTDto })
  async updateProfile(
    @Request() { user }: RefreshTokenRequest,
    @Body() dto: RegisterProfileDto,
  ): Promise<JWTDto> {
    return this.authService.updateProfile(user.userEntity, dto);
  }

  @Patch('/update-email')
  @ApiBearerAuth('access-token')
  @UseGuards(RefreshTokenGuard)
  @ApiBody({ type: updateEmailDto })
  @ApiOkResponse({ type: JWTDto })
  async updateEmail(
    @Request() { user }: RefreshTokenRequest,
    @Body() dto: updateEmailDto,
  ): Promise<JWTDto> {
    return this.authService.updateEmail(user.userEntity, dto);
  }

  @Patch('/update-password')
  @ApiBearerAuth('access-token')
  @UseGuards(RefreshTokenGuard)
  @ApiBody({ type: updatePasswordDto })
  @ApiOkResponse({ type: JWTDto })
  async updatePassword(
    @Request() { user }: RefreshTokenRequest,
    @Body() dto: updatePasswordDto,
  ): Promise<JWTDto> {
    return this.authService.updatePassword(user.userEntity, dto);
  }

  @Patch('/update-avatar')
  @ApiBearerAuth('access-token')
  @UseGuards(RefreshTokenGuard)
  @ApiOkResponse({ type: JWTDto })
  @UseInterceptors(FileInterceptor('avatar', { storage }))
  async updateAvatar(
    @Request() { user }: RefreshTokenRequest,
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
    return this.authService.updateAvatar(user.userEntity, file);
  }

  @Delete('/remove-avatar')
  @ApiBearerAuth('access-token')
  @UseGuards(RefreshTokenGuard)
  @ApiOkResponse({ type: JWTDto })
  async removeAvatar(
    @Request() { user }: RefreshTokenRequest,
  ): Promise<JWTDto> {
    return this.authService.removeAvatar(user.userEntity);
  }

  @Delete('/delete-account')
  @ApiBearerAuth('access-token')
  @UseGuards(RefreshTokenGuard)
  @ApiBody({ type: deleteAccountDto })
  async deleteAccount(
    @Request() { user }: RefreshTokenRequest,
    @Body() dto: deleteAccountDto,
  ): Promise<void> {
    await this.authService.deleteAccount(user.userEntity, dto);
  }
}
