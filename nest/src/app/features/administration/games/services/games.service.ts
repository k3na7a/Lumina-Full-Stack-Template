import { Injectable } from '@nestjs/common';

import { GameEntity } from 'src/app/modules/games/entities/game.entity';
import { GameService } from 'src/app/modules/games/services/games.service';
import { ImageEntity } from 'src/app/modules/media/entities/image.entity';
import { ImageService } from 'src/app/modules/media/services/image.service';

import { GamePaginationOptions, CreateGameDto } from 'src/library/dto/game.dto';
import { PaginationDto } from 'src/library/dto/pagination.dto';
import { IMAGE_TYPE } from 'src/library/enums/image-routes.enum';

@Injectable()
export class GamesAdminService {
  constructor(
    private readonly gameService: GameService,
    private readonly imageService: ImageService,
  ) {}

  private async handleUploadCover(
    game: GameEntity,
    file: Express.Multer.File,
  ): Promise<GameEntity> {
    const cover: ImageEntity = await this.imageService.create({
      file,
      altText: `Game cover for game ID ${game.id}`,
      type: IMAGE_TYPE.COVERS,
    });

    return this.gameService.update(game.id, { ...game, cover });
  }

  public async paginate(
    params: GamePaginationOptions,
  ): Promise<PaginationDto<GameEntity>> {
    return this.gameService.paginate(params);
  }

  public async findOne(id: string): Promise<GameEntity> {
    return this.gameService.findOneById(id);
  }

  public async create(
    dto: CreateGameDto,
    file?: Express.Multer.File,
  ): Promise<GameEntity> {
    await this.gameService.ensureSlugIsUnique(dto.slug);

    const newGame = await this.gameService.create(dto);
    if (file) await this.handleUploadCover(newGame, file);

    return this.gameService.findOneById(newGame.id);
  }

  public async update(id: string, dto: object): Promise<GameEntity> {
    const game = await this.gameService.findOneById(id);

    await this.gameService.update(game.id, dto);

    return this.gameService.findOneById(id);
  }

  public async remove(id: string): Promise<GameEntity> {
    const game = await this.gameService.findOneById(id);

    if (game.cover) await this.imageService.remove(game.cover.id);

    return this.gameService.delete(game.id);
  }
}
