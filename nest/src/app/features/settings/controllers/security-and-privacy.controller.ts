import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Patch,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { CurrentUser } from 'src/app/common/decorators/current-user.decorator';
import { deleteAccountDto } from 'src/app/features/settings/dto/deleteAccount.dto';
import { updateEmailDto } from 'src/app/features/settings/dto/updateEmail.dto';
import { updatePasswordDto } from 'src/app/features/settings/dto/updatePassword.dto';
import { UserEntity } from 'src/app/modules/users/entities/user.entity';
import { JWTDto } from 'src/library/dto/jwt.dto';
import { SettingsService } from '../services/settings.service';
import { RequiresRefreshToken } from 'src/app/common/decorators/refresh-token.decorator';

@ApiTags('Settings / Security & Privacy')
@Controller('security-and-privacy')
@RequiresRefreshToken()
@UseInterceptors(ClassSerializerInterceptor)
export class SecurityController {
  constructor(private readonly service: SettingsService) {}

  @Patch('/email')
  @ApiBody({ type: updateEmailDto })
  @ApiOkResponse({ type: JWTDto })
  async updateEmail(
    @CurrentUser() user: UserEntity,
    @Body() dto: updateEmailDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<JWTDto> {
    return this.service.updateEmail(user, dto, res);
  }

  @Patch('/password')
  @ApiBody({ type: updatePasswordDto })
  @ApiOkResponse({ type: JWTDto })
  async updatePassword(
    @CurrentUser() user: UserEntity,
    @Body() dto: updatePasswordDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<JWTDto> {
    return this.service.updatePassword(user, dto, res);
  }

  @Delete('/delete-account')
  @ApiBody({ type: deleteAccountDto })
  async deleteAccount(
    @CurrentUser() user: UserEntity,
    @Body() dto: deleteAccountDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.service.deleteAccount(user, dto, res);
  }
}
