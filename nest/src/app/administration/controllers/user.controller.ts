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
import { UserEntity } from 'src/library/entities/user/user.entity';
import { Roles } from 'src/app/authentication/decorators/roles.decorator';
import { Role } from 'src/library/enums/role.enum';
import { RefreshTokenGuard } from 'src/app/authentication/guards/refreshtoken.guard';
import { RolesGuard } from 'src/app/authentication/guards/role.guard';
import { UpdateUserDto, UserPaginationOptions } from 'src/library/dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { storage } from 'src/library/config/storage.config';
import { megabyte } from 'src/library/constants/size.constants';
import { UserAdminService } from '../services/user.service';

@ApiTags('Users (Administration)')
@Controller('users')
@Roles([Role.ADMIN])
@UseGuards(RefreshTokenGuard, RolesGuard)
@ApiBearerAuth('access-token')
@UseInterceptors(ClassSerializerInterceptor)
export class UserAdminController {
  constructor(private readonly userAdminService: UserAdminService) {}

  @Get('paginated')
  @ApiOkResponse({ type: PaginationDto<UserEntity> })
  async findAndPaginate(
    @Query() params: UserPaginationOptions,
  ): Promise<PaginationDto<UserEntity>> {
    return this.userAdminService.getUsersPaginated(params);
  }

  @Get('count')
  @ApiOkResponse({ type: Number })
  async getCount(): Promise<number> {
    return this.userAdminService.getUserCount();
  }

  @Get(':id')
  @ApiOkResponse({ type: UserEntity })
  async findOneById(@Param('id') id: string): Promise<UserEntity> {
    return this.userAdminService.findOneById(id);
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
    return this.userAdminService.updateUser(id, dto, file);
  }

  @Delete(':id')
  @ApiOkResponse({ type: UserEntity })
  async deleteUser(@Param('id') id: string): Promise<UserEntity> {
    return this.userAdminService.deleteUser(id);
  }
}
