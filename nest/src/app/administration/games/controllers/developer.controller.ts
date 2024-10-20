import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/app/authentication/decorators/roles.decorator';
import { RefreshTokenGuard } from 'src/app/authentication/guards/refreshtoken.guard';
import { RolesGuard } from 'src/app/authentication/guards/role.guard';
import { Role } from 'src/library/enums/role.enum';

import { DeveloperEntity } from 'src/app/modules/games/entities/developer.entity';
import {
  DeveloperDto,
  DeveloperPaginationOptions,
} from 'src/app/modules/games/dto/developer.dto';
import { DeveloperService } from 'src/app/modules/games/services/developer.service';
import { PaginationDto } from 'src/library/dto/pagination.dto';

@ApiTags('Administration / Game Library / Developers')
@Controller('developers')
@Roles([Role.ADMIN])
@UseGuards(RefreshTokenGuard, RolesGuard)
@ApiBearerAuth('access-token')
@UseInterceptors(ClassSerializerInterceptor)
class DeveloperController {
  constructor(private readonly developerService: DeveloperService) {}

  @Put('')
  @ApiBody({ type: DeveloperDto })
  @ApiOkResponse({ type: DeveloperEntity })
  async create(@Body() dto: DeveloperDto): Promise<DeveloperEntity> {
    return this.developerService.create(dto);
  }

  @Get('')
  @ApiOkResponse({ type: Array<DeveloperEntity> })
  async getAll(): Promise<Array<DeveloperEntity>> {
    return this.developerService.find();
  }

  @Get('paginated')
  @ApiOkResponse({ type: PaginationDto<DeveloperEntity> })
  async paginate(
    @Query() params: DeveloperPaginationOptions,
  ): Promise<PaginationDto<DeveloperEntity>> {
    return this.developerService.paginate(params);
  }

  @Patch(':id')
  @ApiOkResponse({ type: DeveloperEntity })
  @ApiBody({ type: DeveloperDto })
  async update(
    @Param('id') id: string,
    @Body() dto: DeveloperDto,
  ): Promise<DeveloperEntity> {
    return this.developerService.update(id, dto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: DeveloperEntity })
  async delete(@Param('id') id: string): Promise<DeveloperEntity> {
    return this.developerService.remove(id);
  }
}

export { DeveloperController };
