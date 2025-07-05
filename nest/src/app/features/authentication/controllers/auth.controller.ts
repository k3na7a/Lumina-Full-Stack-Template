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
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from '../services/auth.service';

import { CurrentUser } from 'src/app/common/decorators/current-user.decorator';
import { LocalAuthGuard } from 'src/app/common/guards/localAuth.guard';

import { UserEntity } from 'src/app/modules/users/entities/user.entity';

import { ForgotPasswordDto } from 'src/app/features/authentication/dto/forgotPassword.dto';
import { JWTDto } from 'src/library/dto/jwt.dto';
import { RegisterDto } from 'src/app/features/authentication/dto/register.dto';
import { ResetPasswordDto } from 'src/app/features/authentication/dto/resetPassword.dto';
import { SignInDto } from 'src/app/features/authentication/dto/signIn.dto';
import { RequiresRefreshToken } from 'src/app/common/decorators/refresh-token.decorator';
import { Public } from 'src/app/common/decorators/public.decorator';
import { Throttle } from '@nestjs/throttler';
import { minute } from 'src/library/constants/time.constants';
import { RequestContext } from 'src/app/common/providers/request-context.provider';

@Public()
@ApiTags('Authentication')
@Controller('')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly requestContext: RequestContext,
  ) {}

  @Put('/register')
  @Throttle({ default: { limit: 3, ttl: 1 * minute } })
  @ApiBody({ type: RegisterDto })
  @ApiOkResponse({ type: JWTDto })
  async register(@Body() dto: RegisterDto): Promise<JWTDto> {
    return this.authService.register(dto);
  }

  @Post('/sign-in')
  @Throttle({ default: { limit: 5, ttl: 1 * minute } })
  @ApiBody({ type: SignInDto })
  @ApiOkResponse({ type: JWTDto })
  @UseGuards(LocalAuthGuard)
  async signIn(@CurrentUser() user: UserEntity): Promise<JWTDto> {
    return this.authService.signIn(user);
  }

  @Post('/forgot-password')
  @Throttle({ default: { limit: 3, ttl: 1 * minute } })
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<void> {
    await this.authService.forgotPassword(dto);
  }

  @Get('/verify-token')
  @Throttle({ default: { limit: 10, ttl: 1 * minute } })
  @RequiresRefreshToken()
  async verifyToken(@CurrentUser() user: UserEntity): Promise<JWTDto> {
    const store = this.requestContext.getStore();
    console.log(store);

    return this.authService.verify(user);
  }

  @Post('/sign-out')
  @Throttle({ default: { limit: 10, ttl: 1 * minute } })
  @RequiresRefreshToken()
  async signOut(@CurrentUser() user: UserEntity): Promise<void> {
    await this.authService.signOut(user);
  }

  @Post('/reset-password')
  @Throttle({ default: { limit: 3, ttl: 1 * minute } })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(
    @CurrentUser() user: UserEntity,
    @Request() { accessToken }: { accessToken: string },
    @Body('confirm_password') confirm_password: string,
  ): Promise<void> {
    await this.authService.resetPassword(user, confirm_password, accessToken);
  }
}
