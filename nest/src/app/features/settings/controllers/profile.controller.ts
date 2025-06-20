import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { CurrentUser } from 'src/app/common/decorators/current-user.decorator';
import { storage } from 'src/config/storage.config';
import { megabyte } from 'src/library/constants/size.constants';
import { Authenticated } from 'src/app/common/decorators/authenticated.decorator';
import { UserEntity } from 'src/app/modules/users/entities/user.entity';
import { JWTDto } from 'src/library/dto/jwt.dto';
import { RegisterProfileDto } from 'src/library/dto/register.dto';
import { SettingsService } from '../services/settings.service';

@ApiTags('Settings / Profile')
@Controller('profile')
@Authenticated()
@UseInterceptors(ClassSerializerInterceptor)
export class ProfileController {
  constructor(private readonly service: SettingsService) {}

  @Patch('update')
  @ApiBody({ type: RegisterProfileDto })
  @ApiOkResponse({ type: JWTDto })
  async updateProfile(
    @CurrentUser() user: UserEntity,
    @Body() dto: RegisterProfileDto,
  ): Promise<JWTDto> {
    return this.service.updateProfile(user, dto);
  }

  @Post('/avatar/upload')
  @ApiOkResponse({ type: JWTDto })
  @UseInterceptors(FileInterceptor('avatar', { storage }))
  async updateAvatar(
    @CurrentUser() user: UserEntity,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 10 * megabyte,
          }),
          new FileTypeValidator({
            fileType: '.(png|jpeg|jpg|gif)',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<JWTDto> {
    return this.service.updateAvatar(user, file);
  }

  @Delete('/avatar/remove')
  @ApiOkResponse({ type: JWTDto })
  async removeAvatar(@CurrentUser() user: UserEntity): Promise<JWTDto> {
    return this.service.removeAvatar(user);
  }
}
