import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from 'src/app/common/decorators/current-user.decorator';
import { Authenticated } from 'src/app/common/decorators/authenticated.decorator';
import { deleteAccountDto } from 'src/library/dto/deleteAccount.dto';
import { updateEmailDto } from 'src/library/dto/updateEmail.dto';
import { updatePasswordDto } from 'src/library/dto/updatePassword.dto';
import { UserEntity } from 'src/app/modules/users/entities/user.entity';
import { JWTDto } from 'src/library/dto/jwt.dto';
import { SettingsService } from '../services/settings.service';

@ApiTags('Settings / Security & Privacy')
@Controller('security-and-privacy')
@Authenticated()
@UseInterceptors(ClassSerializerInterceptor)
export class SecurityController {
  constructor(private readonly service: SettingsService) {}

  @Delete('/delete-account')
  @ApiBody({ type: deleteAccountDto })
  async deleteAccount(
    @CurrentUser() user: UserEntity,
    @Body() dto: deleteAccountDto,
  ): Promise<void> {
    await this.service.deleteAccount(user, dto);
  }

  @Patch('/email')
  @ApiBody({ type: updateEmailDto })
  @ApiOkResponse({ type: JWTDto })
  async updateEmail(
    @CurrentUser() user: UserEntity,
    @Body() dto: updateEmailDto,
  ): Promise<JWTDto> {
    return this.service.updateEmail(user, dto);
  }

  @Patch('/password')
  @ApiBody({ type: updatePasswordDto })
  @ApiOkResponse({ type: JWTDto })
  async updatePassword(
    @CurrentUser() user: UserEntity,
    @Body() dto: updatePasswordDto,
  ): Promise<JWTDto> {
    return this.service.updatePassword(user, dto);
  }
}
