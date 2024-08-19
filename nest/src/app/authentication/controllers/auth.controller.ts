import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Patch,
  Post,
  Put,
  Request,
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
import { RegisterDto, RegisterProfileDto } from 'src/library/dto/register.dto';
import { JWTDto } from 'src/library/dto/jwt.dto';
import { SignInDto } from 'src/library/dto/signIn.dto';
import { LocalAuthGuard } from '../guards/localAuth.guard';
import { UserEntity } from 'src/library/entities/user.entity';
import { RefreshTokenGuard } from '../guards/refreshtoken.guard';
import { RefreshTokenRequest } from 'src/library/interfaces/refreshToken.interface';
import { ForgotPasswordDto } from 'src/library/dto/forgotPassword.dto';
import { AccessTokenGuard } from '../guards/accesstoken.guard';
import { AccessTokenRequest } from 'src/library/interfaces/accessToken.interface';
import { ResetPasswordDto } from 'src/library/dto/resetPassword.dto';
import { updatePasswordDto } from 'src/library/dto/updatePassword.dto';
import { updateEmailDto } from 'src/library/dto/updateEmail.dto';
import { deleteAccountDto } from 'src/library/dto/deleteAccount.dto';

@ApiTags('Authentication Controller (Self Management)')
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
    await this.authService.forgotPassword(dto.email);
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
