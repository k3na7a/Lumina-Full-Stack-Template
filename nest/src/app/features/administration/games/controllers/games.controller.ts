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
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express/multer';

import { storage } from 'src/config/storage.config';
import { megabyte } from 'src/library/constants/size.constants';
import { PaginationDto } from 'src/library/dto/pagination.dto';
import { Administrator } from 'src/app/common/decorators/administrator.decorator';
import { GameEntity } from 'src/app/modules/games/entities/game.entity';
import { CreateGameDto, GamePaginationOptions } from 'src/library/dto/game.dto';
import { GamesAdminService } from 'src/app/features/administration/games/services/games.service';

@ApiTags('Administration / Games & Software / Games')
@Controller('games')
@Administrator()
@UseInterceptors(ClassSerializerInterceptor)
class GameAdminController {
  constructor(private readonly service: GamesAdminService) {}

  @Put('')
  @ApiBody({ type: CreateGameDto })
  @ApiOkResponse({ type: GameEntity })
  @UseInterceptors(FileInterceptor('cover', { storage }))
  async create(
    @Body() dto: CreateGameDto,
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
  ): Promise<GameEntity> {
    return this.service.create(dto, file);
  }

  @Get('')
  @ApiOkResponse({ type: PaginationDto<GameEntity> })
  async paginate(
    @Query() params: GamePaginationOptions,
  ): Promise<PaginationDto<GameEntity>> {
    return this.service.paginate(params);
  }

  @Get('/:id')
  @ApiOkResponse({ type: GameEntity })
  async getSingle(@Param('id') id: string): Promise<GameEntity> {
    return this.service.findOne(id);
  }

  @Patch('/:id')
  @ApiOkResponse({ type: GameEntity })
  async update(
    @Param('id') id: string,
    @Body() dto: object,
  ): Promise<GameEntity> {
    return this.service.update(id, dto);
  }

  @Delete('/:id')
  @ApiOkResponse({ type: GameEntity })
  async delete(@Param('id') id: string): Promise<GameEntity> {
    return this.service.remove(id);
  }
}

export { GameAdminController };
