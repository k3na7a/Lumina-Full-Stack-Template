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
import { storage } from 'src/library/config/storage.config';
import { RegisterProfileDto } from 'src/app/authentication/dto/register.dto';
import { JWTDto } from 'src/app/authentication/dto/jwt.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { megabyte } from 'src/library/data/constants/size.constants';
import { UserEntity } from 'src/app/users/entities/user.entity';
import { Authenticated } from 'src/app/authentication/decorators/authenticated.decorator';
import { CurrentUser } from 'src/app/authentication/decorators/current-user.decorator';
import { AuthService } from '../services/auth.service';

@ApiTags('My Profile')
@Controller('account/profile')
@Authenticated()
@UseInterceptors(ClassSerializerInterceptor)
export class ProfileController {
  constructor(private readonly authService: AuthService) {}

  @Patch('')
  @ApiBody({ type: RegisterProfileDto })
  @ApiOkResponse({ type: JWTDto })
  async updateProfile(
    @CurrentUser() user: UserEntity,
    @Body() dto: RegisterProfileDto,
  ): Promise<JWTDto> {
    return this.authService.updateProfile(user, dto);
  }

  @Post('/avatar')
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
    return this.authService.updateAvatar(user, file);
  }

  @Delete('/avatar')
  @ApiOkResponse({ type: JWTDto })
  async removeAvatar(@CurrentUser() user: UserEntity): Promise<JWTDto> {
    return this.authService.removeAvatar(user);
  }
}
