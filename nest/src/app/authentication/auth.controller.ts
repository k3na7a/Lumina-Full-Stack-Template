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
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { JWTDto } from './dto/jwt.dto';
import { SignInDto } from './dto/signIn.dto';
import { LocalAuthGuard } from './guards/localAuth.guard';
import { UserEntity } from '../models/users/entities/user.entity';
import { RefreshTokenGuard } from './guards/refreshtoken.guard';
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
  async signIn(
    @Request()
    { user }: { user: UserEntity },
  ): Promise<JWTDto> {
    return this.authService.signIn(user);
  }

  @Post('/sign-out')
  @ApiBearerAuth('access-token')
  @UseGuards(RefreshTokenGuard)
  @ApiOkResponse({ type: JWTDto })
  async signOut(): Promise<string> {
    return 'HELLO THIS IS A TEST';
  }
}
