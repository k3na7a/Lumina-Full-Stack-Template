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
import { FileInterceptor } from '@nestjs/platform-express/multer';

import { storage } from 'src/config/storage.config';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { GameEntity } from 'src/modules/games/entities/game.entity';
import {
  CreateGameDto,
  GamePaginationOptions,
} from 'src/modules/games/dto/game.dto';
import { GamesAdminService } from 'src/features/administration/games/services/games.service';
import { ImageUploadValidationPipe } from 'src/common/pipes/image-upload.pipe';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import {
  PERMISSION_MATRIX,
  PermissionDomain,
} from '@lib/constants/permissions.constants';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('Administration / Games & Software / Games')
@Controller('games')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseInterceptors(ClassSerializerInterceptor)
class GameAdminController {
  constructor(private readonly service: GamesAdminService) {}

  @Put('')
  @ApiBody({ type: CreateGameDto })
  @ApiOkResponse({ type: GameEntity })
  @Permissions(PERMISSION_MATRIX[PermissionDomain.GAME_MANAGEMENT].CREATE_GAME)
  @UseInterceptors(FileInterceptor('cover', { storage }))
  async create(
    @Body() dto: CreateGameDto,
    @UploadedFile(new ImageUploadValidationPipe({}))
    file?: Express.Multer.File,
  ): Promise<GameEntity> {
    return this.service.create(dto, file);
  }

  @Get('')
  @ApiOkResponse({ type: PaginationDto<GameEntity> })
  @Permissions(PERMISSION_MATRIX[PermissionDomain.GAME_MANAGEMENT].READ_GAME)
  async paginate(
    @Query() params: GamePaginationOptions,
  ): Promise<PaginationDto<GameEntity>> {
    return this.service.paginate(params);
  }

  @Get('/:id')
  @ApiOkResponse({ type: GameEntity })
  @Permissions(PERMISSION_MATRIX[PermissionDomain.GAME_MANAGEMENT].READ_GAME)
  async getSingle(@Param('id') id: string): Promise<GameEntity> {
    return this.service.findOne(id);
  }

  @Patch('/:id')
  @ApiOkResponse({ type: GameEntity })
  @UseInterceptors(FileInterceptor('cover', { storage }))
  @Permissions(PERMISSION_MATRIX[PermissionDomain.GAME_MANAGEMENT].UPDATE_GAME)
  async update(
    @Param('id') id: string,
    @Body() dto: CreateGameDto,
    @UploadedFile(new ImageUploadValidationPipe({}))
    file?: Express.Multer.File,
  ): Promise<GameEntity> {
    return this.service.update(id, dto, file);
  }

  @Delete('/:id')
  @ApiOkResponse({ type: GameEntity })
  @Permissions(PERMISSION_MATRIX[PermissionDomain.GAME_MANAGEMENT].DELETE_GAME)
  async delete(@Param('id') id: string): Promise<GameEntity> {
    return this.service.remove(id);
  }
}

export { GameAdminController };
