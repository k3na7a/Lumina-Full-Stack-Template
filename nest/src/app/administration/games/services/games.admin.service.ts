import { Injectable } from '@nestjs/common';
import {
  CreateGameDto,
  GamePaginationOptions,
} from 'src/app/games/dto/game.dto';
import { GameEntity } from 'src/app/games/entities/game.entity';
import { GameService } from 'src/app/games/services/games.service';
import { IMAGE_TYPE } from 'src/app/media/constants/image-routes.constants';
import { ImageEntity } from 'src/app/media/entities/image.entity';
import { ImageService } from 'src/app/media/services/image.service';
import { PaginationDto } from 'src/library/dto/pagination.dto';

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
