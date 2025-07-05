import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express/multer';

import { storage } from 'src/config/storage.config';

import { Administrator } from 'src/app/common/decorators/administrator.decorator';
import { UserAdminService } from 'src/app/features/administration/users/services/users.service';
import { UserEntity } from 'src/app/modules/users/entities/user.entity';

import { PaginationDto } from 'src/library/dto/pagination.dto';
import { UserPaginationOptions, UpdateUserDto } from 'src/app/features/administration/users/dto/user.dto';

import { ImageUploadValidationPipe } from 'src/app/common/pipes/image-upload.pipe';

@ApiTags('Administration / User Management / Users')
@Controller('users')
@Administrator()
@UseInterceptors(ClassSerializerInterceptor)
class UserAdminController {
  constructor(private readonly service: UserAdminService) {}

  @Get('')
  @ApiOkResponse({ type: PaginationDto<UserEntity> })
  async paginate(
    @Query() params: UserPaginationOptions,
  ): Promise<PaginationDto<UserEntity>> {
    return this.service.paginate(params);
  }

  @Get('/:id')
  @ApiOkResponse({ type: UserEntity })
  async getSingle(@Param('id') id: string): Promise<UserEntity> {
    return this.service.findOneById(id);
  }

  @Patch('/:id')
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: UserEntity })
  @UseInterceptors(FileInterceptor('avatar', { storage }))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @UploadedFile(new ImageUploadValidationPipe({}))
    file?: Express.Multer.File,
  ): Promise<UserEntity> {
    return this.service.update(id, dto, file);
  }

  @Delete('/:id')
  @ApiOkResponse({ type: UserEntity })
  async delete(@Param('id') id: string): Promise<UserEntity> {
    return this.service.remove(id);
  }
}

export { UserAdminController };
