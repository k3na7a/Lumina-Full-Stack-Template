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

import { AuthService } from '../services/auth.service';
import { RegisterProfileDto } from 'src/app/authentication/dto/register.dto';
import { JWTDto } from 'src/app/authentication/dto/jwt.dto';
import { UserEntity } from 'src/app/users/entities/user.entity';
import { CurrentUser } from '../decorators/current-user.decorator';
import { storage } from 'src/library/config/storage.config';
import { megabyte } from 'src/library/data/constants/size.constants';
import { Authenticated } from '../decorators/authenticated.decorator';
import { deleteAccountDto } from '../dto/deleteAccount.dto';
import { updateEmailDto } from '../dto/updateEmail.dto';
import { updatePasswordDto } from '../dto/updatePassword.dto';

@ApiTags('My Account')
@Controller('account')
@Authenticated()
@UseInterceptors(ClassSerializerInterceptor)
export class ProfileAuthController {
  constructor(private readonly authService: AuthService) {}

  @Delete('')
  @ApiBody({ type: deleteAccountDto })
  async deleteAccount(
    @CurrentUser() user: UserEntity,
    @Body() dto: deleteAccountDto,
  ): Promise<void> {
    await this.authService.deleteAccount(user, dto);
  }

  @Patch('/email')
  @ApiBody({ type: updateEmailDto })
  @ApiOkResponse({ type: JWTDto })
  async updateEmail(
    @CurrentUser() user: UserEntity,
    @Body() dto: updateEmailDto,
  ): Promise<JWTDto> {
    return this.authService.updateEmail(user, dto);
  }

  @Patch('/password')
  @ApiBody({ type: updatePasswordDto })
  @ApiOkResponse({ type: JWTDto })
  async updatePassword(
    @CurrentUser() user: UserEntity,
    @Body() dto: updatePasswordDto,
  ): Promise<JWTDto> {
    return this.authService.updatePassword(user, dto);
  }

  @Patch('/profile')
  @ApiBody({ type: RegisterProfileDto })
  @ApiOkResponse({ type: JWTDto })
  async updateProfile(
    @CurrentUser() user: UserEntity,
    @Body() dto: RegisterProfileDto,
  ): Promise<JWTDto> {
    return this.authService.updateProfile(user, dto);
  }

  @Post('/profile/avatar')
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

  @Delete('/profile/avatar')
  @ApiOkResponse({ type: JWTDto })
  async removeAvatar(@CurrentUser() user: UserEntity): Promise<JWTDto> {
    return this.authService.removeAvatar(user);
  }
}
