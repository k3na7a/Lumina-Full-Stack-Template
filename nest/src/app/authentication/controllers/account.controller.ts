import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JWTDto } from 'src/app/authentication/dto/jwt.dto';
import { updatePasswordDto } from 'src/app/authentication/dto/updatePassword.dto';
import { updateEmailDto } from 'src/app/authentication/dto/updateEmail.dto';
import { deleteAccountDto } from 'src/app/authentication/dto/deleteAccount.dto';
import { UserEntity } from 'src/app/users/entities/user.entity';
import { Authenticated } from 'src/app/authentication/decorators/authenticated.decorator';
import { CurrentUser } from 'src/app/authentication/decorators/current-user.decorator';
import { AuthService } from '../services/auth.service';

@ApiTags('My Account')
@Controller('account')
@Authenticated()
@UseInterceptors(ClassSerializerInterceptor)
export class AccountController {
  constructor(private readonly authService: AuthService) {}

  @Get('verify-token')
  @ApiBearerAuth('access-token')
  async verifyToken(@CurrentUser() user: UserEntity): Promise<JWTDto> {
    return this.authService.issueTokens(user);
  }

  @Post('/sign-out')
  async signOut(@CurrentUser() user: UserEntity): Promise<void> {
    await this.authService.signOut(user);
  }

  @Patch('/update-email')
  @ApiBody({ type: updateEmailDto })
  @ApiOkResponse({ type: JWTDto })
  async updateEmail(
    @CurrentUser() user: UserEntity,
    @Body() dto: updateEmailDto,
  ): Promise<JWTDto> {
    return this.authService.updateEmail(user, dto);
  }

  @Patch('/update-password')
  @ApiBody({ type: updatePasswordDto })
  @ApiOkResponse({ type: JWTDto })
  async updatePassword(
    @CurrentUser() user: UserEntity,
    @Body() dto: updatePasswordDto,
  ): Promise<JWTDto> {
    return this.authService.updatePassword(user, dto);
  }

  @Delete('/remove-account')
  @ApiBody({ type: deleteAccountDto })
  async deleteAccount(
    @CurrentUser() user: UserEntity,
    @Body() dto: deleteAccountDto,
  ): Promise<void> {
    await this.authService.deleteAccount(user, dto);
  }
}
