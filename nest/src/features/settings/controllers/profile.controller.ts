import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { storage } from 'src/config/storage.config';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { JWTDto } from 'src/common/dto/jwt.dto';
import { RegisterProfileDto } from 'src/features/authentication/dto/register.dto';
import { SettingsService } from '../services/settings.service';
import { ImageUploadValidationPipe } from 'src/common/pipes/image-upload.pipe';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import {
  PERMISSION_MATRIX,
  PermissionDomain,
} from '@lib/constants/permissions.constants';

@ApiTags('Settings / Profile')
@Controller('profile')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ProfileController {
  constructor(private readonly service: SettingsService) {}

  @Patch('update')
  @ApiBody({ type: RegisterProfileDto })
  @ApiOkResponse({ type: JWTDto })
  @Permissions(PERMISSION_MATRIX[PermissionDomain.SELF_MANAGEMENT].UPDATE_SELF)
  async updateProfile(
    @CurrentUser() user: UserEntity,
    @Body() dto: RegisterProfileDto,
  ): Promise<UserEntity> {
    return this.service.updateProfile(user, dto);
  }

  @Post('/avatar/upload')
  @ApiOkResponse({ type: JWTDto })
  @UseInterceptors(FileInterceptor('avatar', { storage }))
  @Permissions(PERMISSION_MATRIX[PermissionDomain.SELF_MANAGEMENT].UPDATE_SELF)
  async updateAvatar(
    @CurrentUser() user: UserEntity,
    @UploadedFile(new ImageUploadValidationPipe({ fileIsRequired: true }))
    file: Express.Multer.File,
  ): Promise<UserEntity> {
    return this.service.updateAvatar(user, file);
  }

  @Delete('/avatar/remove')
  @ApiOkResponse({ type: JWTDto })
  @Permissions(PERMISSION_MATRIX[PermissionDomain.SELF_MANAGEMENT].UPDATE_SELF)
  async removeAvatar(@CurrentUser() user: UserEntity): Promise<UserEntity> {
    return this.service.removeAvatar(user);
  }
}
