import { BadRequestException, Injectable } from '@nestjs/common';

import { GameEntity } from 'src/app/modules/games/entities/game.entity';
import { GameService } from 'src/app/modules/games/services/games.service';
import { PlatformService } from 'src/app/modules/games/services/platforms.service';
import { ImageEntity } from 'src/app/modules/media/entities/image.entity';
import { ImageService } from 'src/app/modules/media/services/image.service';

import {
  GamePaginationOptions,
  CreateGameDto,
} from 'src/app/modules/games/dto/game.dto';
import { PaginationDto } from 'src/app/common/dto/pagination.dto';
import { IMAGE_TYPE } from 'src/app/modules/media/enums/image-routes.enum';
import { iaudit } from 'src/app/modules/audit/dto/audit.dto';
import { AuditEntity } from 'src/app/modules/audit/entities/audit.entity';
import {
  buildAuditSnapshotsAndDiff,
  redactHeaders,
} from '@lib/utilities/object.util';
import {
  Action,
  ActorType,
  Domain,
  SourceType,
  SUB_DOMAIN,
} from '@lib/dto/audit.dto';

import { AuditService } from 'src/app/modules/audit/service/audit.service';
import { RequestContext } from 'src/app/common/providers/request-context.provider';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class GamesAdminService {
  constructor(
    private readonly gameService: GameService,
    private readonly imageService: ImageService,
    private readonly platformService: PlatformService,
    private readonly auditService: AuditService,
    private readonly requestContext: RequestContext,
  ) {}

  private async handleCreateCover(
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

  private async handleUpdateCover(game: GameEntity, file: Express.Multer.File) {
    if (!game.cover)
      throw new BadRequestException('Game does not have a cover');

    const cover: ImageEntity = await this.imageService.update(game.cover.id, {
      file,
      altText: game.cover.altText,
      type: IMAGE_TYPE.COVERS,
    });

    return this.gameService.update(game.id, { ...game, cover });
  }

  private async handleUploadCover(
    game: GameEntity,
    file: Express.Multer.File,
  ): Promise<GameEntity> {
    if (game.cover) return this.handleUpdateCover(game, file);
    return this.handleCreateCover(game, file);
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

    const platforms = await this.platformService.findManyById(dto.platforms);

    const newGame = await this.gameService.create({
      ...dto,
      platforms,
    });

    if (file) await this.handleCreateCover(newGame, file);

    const game = await this.gameService.findOneById(newGame.id);

    await this.audit({
      action: Action.CREATE,
      entityId: game.id,
      entityDisplay: game.slug,
      before: instanceToPlain(null),
      after: instanceToPlain(game),
      reason: 'Game added to library by administrator.',
    });

    return game;
  }

  public async update(
    id: string,
    dto: CreateGameDto,
    file?: Express.Multer.File,
  ): Promise<GameEntity> {
    await this.gameService.ensureSlugIsUnique(dto.slug, id);

    const game = await this.gameService.findOneById(id);
    const platforms = await this.platformService.findManyById(dto.platforms);

    if (file) await this.handleUploadCover(game, file);

    await this.gameService.update(game.id, { ...dto, platforms });

    const updatedGame = await this.gameService.findOneById(id);

    await this.audit({
      action: Action.UPDATE,
      entityId: updatedGame.id,
      entityDisplay: updatedGame.slug,
      before: instanceToPlain(game),
      after: instanceToPlain(updatedGame),
      reason: 'Game updated in library by administrator.',
    });

    return updatedGame;
  }

  public async remove(id: string): Promise<GameEntity> {
    const game = await this.gameService.findOneById(id);

    if (game.cover) await this.imageService.remove(game.cover.id);

    await this.audit({
      action: Action.UPDATE,
      entityId: game.id,
      entityDisplay: game.slug,
      before: instanceToPlain(game),
      after: instanceToPlain(null),
      reason: 'Game removed from library by administrator.',
    });

    return this.gameService.delete(game.id);
  }

  private async audit(payload: iaudit): Promise<AuditEntity> {
    const { diff, beforeRedacted, afterRedacted } = buildAuditSnapshotsAndDiff(
      payload.before,
      payload.after,
      [],
      ['platforms'],
    );

    const { request } = this.requestContext.getStore() ?? {};
    const { url, method, headers } = request ?? {};

    return this.auditService.create({
      ...payload,
      actorType: ActorType.USER,
      source: SourceType.ADMIN_UI,
      domain: Domain.GAMES_AND_SOFTWARE,
      subDomain: SUB_DOMAIN.GAME,
      before: beforeRedacted,
      after: afterRedacted,
      diff: diff,
      metadata: {
        path: url,
        method,
        headers: headers ? redactHeaders(headers) : undefined,
      },
    });
  }
}
