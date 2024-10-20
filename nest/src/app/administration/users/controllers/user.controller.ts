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
  Query,
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

import { PaginationDto } from 'src/library/dto/pagination.dto';
import { Roles } from 'src/app/authentication/decorators/roles.decorator';
import { Role } from 'src/library/enums/role.enum';
import { RefreshTokenGuard } from 'src/app/authentication/guards/refreshtoken.guard';
import { RolesGuard } from 'src/app/authentication/guards/role.guard';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { storage } from 'src/library/config/storage.config';
import { megabyte } from 'src/library/constants/size.constants';
import {
  UserPaginationOptions,
  UpdateUserDto,
} from 'src/app/modules/users/dto/user.dto';
import { UserEntity } from 'src/app/modules/users/entities/user.entity';
import { UserService } from 'src/app/modules/users/services/users.service';

@ApiTags('Administration / Users')
@Controller('users')
@Roles([Role.ADMIN])
@UseGuards(RefreshTokenGuard, RolesGuard)
@ApiBearerAuth('access-token')
@UseInterceptors(ClassSerializerInterceptor)
class UserAdminController {
  constructor(private readonly userService: UserService) {}

  @Get('paginated')
  @ApiOkResponse({ type: PaginationDto<UserEntity> })
  async paginate(
    @Query() params: UserPaginationOptions,
  ): Promise<PaginationDto<UserEntity>> {
    return this.userService.paginate(params);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: UserEntity })
  @UseInterceptors(FileInterceptor('avatar', { storage }))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
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
    file?: Express.Multer.File,
  ): Promise<UserEntity> {
    return this.userService.edit(id, dto, file);
  }

  @Delete(':id')
  @ApiOkResponse({ type: UserEntity })
  async delete(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.remove(id);
  }
}

export { UserAdminController };
