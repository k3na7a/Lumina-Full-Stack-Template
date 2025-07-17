import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Patch,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

import { CurrentUser } from 'src/app/common/decorators/current-user.decorator';
import { deleteAccountDto } from 'src/app/features/settings/dto/deleteAccount.dto';
import { updateEmailDto } from 'src/app/features/settings/dto/updateEmail.dto';
import { updatePasswordDto } from 'src/app/features/settings/dto/updatePassword.dto';
import { UserEntity } from 'src/app/modules/users/entities/user.entity';
import { JWTDto } from 'src/app/common/dto/jwt.dto';
import { SettingsService } from '../services/settings.service';
import { Permissions } from 'src/app/common/decorators/permissions.decorator';
import {
  PERMISSION_MATRIX,
  PermissionDomain,
} from '@lib/constants/permissions.constants';
import { PermissionsGuard } from 'src/app/common/guards/permissions.guard';
import { CsrfGuard } from 'src/app/common/guards/csrf.guard';
import { RefreshTokenGuard } from 'src/app/common/guards/refreshtoken.guard';

@ApiTags('Settings / Security & Privacy')
@Controller('security-and-privacy')
@ApiBearerAuth('access-token')
@UseGuards(CsrfGuard, RefreshTokenGuard, PermissionsGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class SecurityController {
  constructor(private readonly service: SettingsService) {}

  @Patch('/email')
  @ApiBody({ type: updateEmailDto })
  @ApiOkResponse({ type: JWTDto })
  @Permissions(PERMISSION_MATRIX[PermissionDomain.SELF_MANAGEMENT].UPDATE_SELF)
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
  @Permissions(PERMISSION_MATRIX[PermissionDomain.SELF_MANAGEMENT].UPDATE_SELF)
  async updatePassword(
    @CurrentUser() user: UserEntity,
    @Body() dto: updatePasswordDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<JWTDto> {
    return this.service.updatePassword(user, dto, res);
  }

  @Delete('/delete-account')
  @ApiBody({ type: deleteAccountDto })
  @Permissions(PERMISSION_MATRIX[PermissionDomain.SELF_MANAGEMENT].DELETE_SELF)
  async deleteAccount(
    @CurrentUser() user: UserEntity,
    @Body() dto: deleteAccountDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.service.deleteAccount(user, dto, res);
  }
}
