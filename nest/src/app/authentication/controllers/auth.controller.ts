import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
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
import { RegisterDto } from 'src/app/authentication/dto/register.dto';
import { JWTDto } from 'src/app/authentication/dto/jwt.dto';
import { SignInDto } from 'src/app/authentication/dto/signIn.dto';
import { LocalAuthGuard } from '../guards/localAuth.guard';
import { ForgotPasswordDto } from 'src/app/authentication/dto/forgotPassword.dto';
import { AccessTokenGuard } from '../guards/accesstoken.guard';
import { ResetPasswordDto } from 'src/app/authentication/dto/resetPassword.dto';
import { UserEntity } from 'src/app/users/entities/user.entity';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Authenticated } from '../decorators/authenticated.decorator';

@ApiTags('Authentication')
@Controller('')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Put('/register')
  @ApiBody({ type: RegisterDto })
  @ApiOkResponse({ type: JWTDto })
  async register(@Body() dto: RegisterDto): Promise<JWTDto> {
    return this.authService.register(dto);
  }

  @Get('/verify-token')
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

  @Post('/reset-password')
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
}
