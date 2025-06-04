import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { storage } from 'src/library/config/storage.config';
import { megabyte } from 'src/library/data/constants/size.constants';
import { GameEntity } from 'src/app/games/entities/game.entity';
import {
  CreateGameDto,
  GamePaginationOptions,
} from 'src/app/games/dto/game.dto';
import { PaginationDto } from 'src/library/dto/pagination.dto';
import { GamesAdminService } from '../services/games.service';

@ApiTags('Administration / Games')
@Controller('games')
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
}

export { GameAdminController };
