import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Request,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response, Request as RequestType } from 'express';
import { Throttle } from '@nestjs/throttler';

import { AuthService } from '../services/auth.service';

import { CurrentUser } from 'src/app/common/decorators/current-user.decorator';
import { LocalAuthGuard } from 'src/app/common/guards/localAuth.guard';

import { UserEntity } from 'src/app/modules/users/entities/user.entity';

import { ForgotPasswordDto } from 'src/app/features/authentication/dto/forgotPassword.dto';
import { CsrfDto, JWTDto } from 'src/library/dto/jwt.dto';
import { RegisterDto } from 'src/app/features/authentication/dto/register.dto';
import { ResetPasswordDto } from 'src/app/features/authentication/dto/resetPassword.dto';
import { SignInDto } from 'src/app/features/authentication/dto/signIn.dto';
import { RequiresRefreshToken } from 'src/app/common/decorators/refresh-token.decorator';
import { hour, minute } from 'src/library/constants/time.constants';

@ApiTags('Authentication')
@Controller('')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/csrf-token')
  @Throttle({ default: { limit: 10, ttl: 1 * minute } })
  async getCsrfToken(@Req() req: RequestType, @Res() res: Response) {
    const iat = Date.now();
    const token = req.csrfToken();
    const exp = iat + 1 * hour;

    res.json(
      new CsrfDto({
        token,
        exp,
        iat,
      }),
    );
  }

  @Put('/register')
  @Throttle({ default: { limit: 3, ttl: 1 * minute } })
  @ApiBody({ type: RegisterDto })
  @ApiOkResponse({ type: JWTDto })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<JWTDto> {
    return this.authService.register(dto, res);
  }

  @Post('/sign-in')
  @Throttle({ default: { limit: 5, ttl: 1 * minute } })
  @ApiBody({ type: SignInDto })
  @ApiOkResponse({ type: JWTDto })
  @UseGuards(LocalAuthGuard)
  async signIn(
    @CurrentUser() user: UserEntity,
    @Res({ passthrough: true }) res: Response,
  ): Promise<JWTDto> {
    return this.authService.signIn(user, res);
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
  async verifyToken(
    @CurrentUser() user: UserEntity,
    @Res({ passthrough: true }) res: Response,
  ): Promise<JWTDto> {
    return this.authService.verify(user, res);
  }

  @Post('/sign-out')
  @Throttle({ default: { limit: 10, ttl: 1 * minute } })
  @RequiresRefreshToken()
  async signOut(
    @CurrentUser() user: UserEntity,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.authService.signOut(user, res);
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
