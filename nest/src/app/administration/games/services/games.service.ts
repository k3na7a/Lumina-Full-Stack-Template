import { Injectable } from '@nestjs/common';
import {
  CreateGameDto,
  GamePaginationOptions,
} from 'src/app/games/dto/game.dto';
import { AssetsEntity } from 'src/app/games/entities/assets.entity';
import { GameEntity } from 'src/app/games/entities/game.entity';
import { AssetsService } from 'src/app/games/services/assets.service';
import { GameService } from 'src/app/games/services/games.service';
import { IMAGE_TYPE } from 'src/app/media/constants/image-routes.constants';
import { ImageEntity } from 'src/app/media/entities/image.entity';
import { ImageService } from 'src/app/media/services/image.service';
import { PaginationDto } from 'src/library/dto/pagination.dto';

@Injectable()
export class GamesAdminService {
  constructor(
    private readonly gameService: GameService,
    private readonly assetsService: AssetsService,
    private readonly imageService: ImageService,
  ) {}

  public async paginate(
    params: GamePaginationOptions,
  ): Promise<PaginationDto<GameEntity>> {
    return this.gameService.paginate(params);
  }

  private async handleUploadCover(
    assets: AssetsEntity,
    file: Express.Multer.File,
  ): Promise<AssetsEntity> {
    const cover: ImageEntity = await this.imageService.create({
      file,
      altText: 'Game cover (large)',
      type: IMAGE_TYPE.COVERS,
    });

    return this.assetsService.update(assets.id, {
      coverLarge: cover,
    });
  }

  public async create(
    dto: CreateGameDto,
    file?: Express.Multer.File,
  ): Promise<GameEntity> {
    await this.gameService.ensureSlugIsUnique(dto.slug);

    const newGame = await this.gameService.create(dto);
    if (file) await this.handleUploadCover(newGame.assets, file);

    return this.gameService.findOneById(newGame.id);
  }

  public async remove(id: string): Promise<GameEntity> {
    const game = await this.gameService.findOneById(id);

    return this.gameService.delete(game.id);
  }
}
