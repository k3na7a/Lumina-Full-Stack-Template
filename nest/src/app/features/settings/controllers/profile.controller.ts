import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { CurrentUser } from 'src/app/common/decorators/current-user.decorator';
import { storage } from 'src/config/storage.config';
import { UserEntity } from 'src/app/modules/users/entities/user.entity';
import { JWTDto } from 'src/library/dto/jwt.dto';
import { RegisterProfileDto } from 'src/app/features/authentication/dto/register.dto';
import { SettingsService } from '../services/settings.service';
import { ImageUploadValidationPipe } from 'src/app/common/pipes/image-upload.pipe';

@ApiTags('Settings / Profile')
@Controller('profile')
@ApiBearerAuth('access-token')
@UseInterceptors(ClassSerializerInterceptor)
export class ProfileController {
  constructor(private readonly service: SettingsService) {}

  @Patch('update')
  @ApiBody({ type: RegisterProfileDto })
  @ApiOkResponse({ type: JWTDto })
  async updateProfile(
    @CurrentUser() user: UserEntity,
    @Body() dto: RegisterProfileDto,
  ): Promise<UserEntity> {
    return this.service.updateProfile(user, dto);
  }

  @Post('/avatar/upload')
  @ApiOkResponse({ type: JWTDto })
  @UseInterceptors(FileInterceptor('avatar', { storage }))
  async updateAvatar(
    @CurrentUser() user: UserEntity,
    @UploadedFile(new ImageUploadValidationPipe({ fileIsRequired: true }))
    file: Express.Multer.File,
  ): Promise<UserEntity> {
    return this.service.updateAvatar(user, file);
  }

  @Delete('/avatar/remove')
  @ApiOkResponse({ type: JWTDto })
  async removeAvatar(@CurrentUser() user: UserEntity): Promise<UserEntity> {
    return this.service.removeAvatar(user);
  }
}
