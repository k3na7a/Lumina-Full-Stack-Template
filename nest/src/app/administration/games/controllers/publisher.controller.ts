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

import { PublisherEntity } from 'src/app/modules/games/entities/publisher.entity';
import {
  PublisherDto,
  PublisherPaginationOptions,
} from 'src/app/modules/games/dto/publisher.dto';
import { PublisherService } from 'src/app/modules/games/services/publisher.service';
import { PaginationDto } from 'src/library/dto/pagination.dto';

@ApiTags('Administration / Game Library / Publishers')
@Controller('publishers')
@Roles([Role.ADMIN])
@UseGuards(RefreshTokenGuard, RolesGuard)
@ApiBearerAuth('access-token')
@UseInterceptors(ClassSerializerInterceptor)
class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @Put('')
  @ApiBody({ type: PublisherDto })
  @ApiOkResponse({ type: PublisherEntity })
  async create(@Body() dto: PublisherDto): Promise<PublisherEntity> {
    return this.publisherService.create(dto);
  }

  @Get('')
  @ApiOkResponse({ type: Array<PublisherEntity> })
  async getAll(): Promise<Array<PublisherEntity>> {
    return this.publisherService.find();
  }

  @Get('paginated')
  @ApiOkResponse({ type: PaginationDto<PublisherEntity> })
  async paginate(
    @Query() params: PublisherPaginationOptions,
  ): Promise<PaginationDto<PublisherEntity>> {
    return this.publisherService.paginate(params);
  }

  @Patch(':id')
  @ApiOkResponse({ type: PublisherEntity })
  @ApiBody({ type: PublisherDto })
  async update(
    @Param('id') id: string,
    @Body() dto: PublisherDto,
  ): Promise<PublisherEntity> {
    return this.publisherService.update(id, dto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: PublisherEntity })
  async delete(@Param('id') id: string): Promise<PublisherEntity> {
    return this.publisherService.remove(id);
  }
}

export { PublisherController };
