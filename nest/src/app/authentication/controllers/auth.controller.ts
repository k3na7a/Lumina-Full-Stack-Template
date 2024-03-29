// #region @imports
// NODE IMPORTS
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
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
// PROJECT IMPORTS
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { JWTDto } from '../dto/jwt.dto';
import { SignInDto } from '../dto/signIn.dto';
import { LocalAuthGuard } from '../guards/localAuth.guard';
import { UserEntity } from '../../models/users/entities/user.entity';
import { RefreshTokenGuard } from '../guards/refreshtoken.guard';
import { RefreshTokenRequest } from '../interfaces/refreshToken.interface';
import { ForgotPasswordDto } from '../dto/forgotPassword.dto';
// #endregion

@ApiTags('Authentication')
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

  @Post('/sign-in')
  @ApiBody({ type: SignInDto })
  @ApiOkResponse({ type: JWTDto })
  @UseGuards(LocalAuthGuard)
  async signIn(@Request() { user }: { user: UserEntity }): Promise<JWTDto> {
    return this.authService.signIn(user);
  }

  @Post('/forgot-password')
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<any> {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('/sign-out')
  @ApiBearerAuth('access-token')
  @UseGuards(RefreshTokenGuard)
  async signOut(@Request() { user }: RefreshTokenRequest): Promise<void> {
    return this.authService.signOut(user.userEntity);
  }

  @Post('/verify-token')
  @ApiBearerAuth('access-token')
  @UseGuards(RefreshTokenGuard)
  @ApiOkResponse({ type: JWTDto })
  async verifyToken(@Request() { user }: RefreshTokenRequest): Promise<JWTDto> {
    return this.authService.verifyToken(user.userEntity);
  }
}
