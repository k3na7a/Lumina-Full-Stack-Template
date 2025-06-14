import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { PaginationDto } from 'src/library/data/dto/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { storage } from 'src/library/config/storage.config';
import { megabyte } from 'src/library/data/constants/size.constants';
import {
  UserPaginationOptions,
  UpdateUserDto,
} from 'src/app/users/dto/user.dto';
import { UserEntity } from 'src/app/users/entities/user.entity';
import { Administrator } from '../../../authentication/decorators/administrator.decorator';
import { UserAdminService } from '../services/users.admin.service';

@ApiTags('Administration / User Management / Users')
@Controller('users')
@Administrator()
@UseInterceptors(ClassSerializerInterceptor)
class UserAdminController {
  constructor(private readonly userService: UserAdminService) {}

  @Get('')
  @ApiOkResponse({ type: PaginationDto<UserEntity> })
  async paginate(
    @Query() params: UserPaginationOptions,
  ): Promise<PaginationDto<UserEntity>> {
    return this.userService.paginate(params);
  }

  @Get('/:id')
  @ApiOkResponse({ type: UserEntity })
  async getSingle(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.findOneById(id);
  }

  @Patch('/:id')
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: UserEntity })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.userService.update(id, dto);
  }

  @Delete('/:id')
  @ApiOkResponse({ type: UserEntity })
  async delete(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.remove(id);
  }

  @Post('/:id/profile/avatar')
  @ApiOkResponse({ type: UserEntity })
  @UseInterceptors(FileInterceptor('avatar', { storage }))
  async handleAvatarUpload(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
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
  ): Promise<UserEntity> {
    return this.userService.handleUploadAvatar(id, file);
  }

  @Delete('/:id/profile/avatar')
  @ApiOkResponse({ type: UserEntity })
  async removeAvatar(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.handleRemoveAvatar(id);
  }
}

export { UserAdminController };
