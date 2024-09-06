import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { UserService } from 'src/app/models/users/services/users.service';
import {
  PaginationDto,
  PaginationOptions,
} from 'src/library/dto/pagination.dto';
import { UserEntity } from 'src/library/entities/user.entity';
import { Roles } from 'src/app/authentication/decorators/roles.decorator';
import { Role } from 'src/library/enums/role.enum';
import { RefreshTokenGuard } from 'src/app/authentication/guards/refreshtoken.guard';
import { RolesGuard } from 'src/app/authentication/guards/role.guard';

@ApiTags('Users (Administration)')
@Controller('users')
@Roles([Role.ADMIN])
@UseGuards(RefreshTokenGuard, RolesGuard)
@ApiBearerAuth('access-token')
@UseInterceptors(ClassSerializerInterceptor)
export class UserAdminController {
  constructor(private readonly userService: UserService) {}

  @Get('paginated')
  @ApiOkResponse({ type: PaginationDto<UserEntity> })
  async findAndPaginate(
    @Query() params: PaginationOptions,
  ): Promise<PaginationDto<UserEntity>> {
    return this.userService.paginate(params);
  }

  @Get(':id')
  @ApiOkResponse({ type: UserEntity })
  async findOneById(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.findOneById(id);
  }
}
