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
import { megabyte } from 'src/library/constants/size.constants';
import { storage } from 'src/library/config/storage.config';
import { Roles } from 'src/app/authentication/decorators/roles.decorator';
import { RefreshTokenGuard } from 'src/app/authentication/guards/refreshtoken.guard';
import { RolesGuard } from 'src/app/authentication/guards/role.guard';
import { Role } from 'src/library/enums/role.enum';

import { PaginationDto } from 'src/library/dto/pagination.dto';
import { GameService } from 'src/app/modules/games/services/game.service';
import { GameEntity } from 'src/app/modules/games/entities/game.entity';
import {
  GameDto,
  GamePaginationOptions,
} from 'src/app/modules/games/dto/game.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Administration / Game Library / Games')
@Controller('games')
@Roles([Role.ADMIN])
@UseGuards(RefreshTokenGuard, RolesGuard)
@ApiBearerAuth('access-token')
@UseInterceptors(ClassSerializerInterceptor)
class GameController {
  constructor(private readonly gameService: GameService) {}

  @Put('')
  @ApiBody({ type: GameDto })
  @ApiOkResponse({ type: GameEntity })
  @UseInterceptors(FileInterceptor('cover', { storage }))
  async create(
    @Body() dto: GameDto,
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
    return this.gameService.create(dto, file);
  }

  @Get('paginated')
  @ApiOkResponse({ type: PaginationDto<GameEntity> })
  async paginate(
    @Query() params: GamePaginationOptions,
  ): Promise<PaginationDto<GameEntity>> {
    const games = await this.gameService.paginate(params);
    return games;
  }

  @Delete(':id')
  @ApiOkResponse({ type: GameEntity })
  async delete(@Param('id') id: string): Promise<GameEntity> {
    return this.gameService.remove(id);
  }
}

export { GameController };
