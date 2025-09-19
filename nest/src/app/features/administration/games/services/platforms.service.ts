import { Injectable } from '@nestjs/common';

import { PlatformEntity } from 'src/app/modules/games/entities/platform.entity';
import { PlatformService } from 'src/app/modules/games/services/platforms.service';

import { PaginationDto } from 'src/app/common/dto/pagination.dto';
import {
  CreatePlatformDto,
  PlatformPaginationOptions,
} from 'src/app/modules/games/dto/platform.dto';
import { iaudit } from 'src/app/modules/audit/dto/audit.dto';
import { AuditEntity } from 'src/app/modules/audit/entities/audit.entity';
import {
  buildAuditSnapshotsAndDiff,
  redactHeaders,
} from '@lib/utilities/object.util';
import { AuditService } from 'src/app/modules/audit/service/audit.service';
import { RequestContext } from 'src/app/common/providers/request-context.provider';
import {
  Action,
  ActorType,
  Domain,
  SourceType,
  SUB_DOMAIN,
} from '@lib/dto/audit.dto';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class PlatformAdminService {
  constructor(
    private readonly service: PlatformService,
    private readonly auditService: AuditService,
    private readonly requestContext: RequestContext,
  ) {}

  public async create(dto: CreatePlatformDto): Promise<PlatformEntity> {
    const platform = await this.service.create(dto);

    await this.audit({
      action: Action.CREATE,
      entityId: platform.id,
      entityDisplay: platform.slug,
      before: instanceToPlain(null),
      after: instanceToPlain(platform),
      reason: 'Gaming platform added to library by administrator.',
    });

    return platform;
  }

  public async paginate(
    params: PlatformPaginationOptions,
  ): Promise<PaginationDto<PlatformEntity>> {
    return this.service.paginate(params);
  }

  public async findOne(id: string): Promise<PlatformEntity> {
    return this.service.findOneById(id);
  }

  public async update(
    id: string,
    dto: CreatePlatformDto,
  ): Promise<PlatformEntity> {
    const platform = await this.findOne(id);

    await this.service.update(platform.id, dto);
    const updatedPlatform = await this.findOne(id);

    await this.audit({
      action: Action.UPDATE,
      entityId: updatedPlatform.id,
      entityDisplay: updatedPlatform.slug,
      before: instanceToPlain(platform),
      after: instanceToPlain(updatedPlatform),
      reason: 'Gaming platform updated in library by administrator.',
    });

    return updatedPlatform;
  }

  public async remove(id: string): Promise<PlatformEntity> {
    const platform = await this.findOne(id);

    await this.audit({
      action: Action.DELETE,
      entityId: platform.id,
      entityDisplay: platform.slug,
      before: instanceToPlain(platform),
      after: instanceToPlain(null),
      reason: 'Gaming platform removed from library by administrator.',
    });

    return this.service.delete(platform.id);
  }

  private async audit(payload: iaudit): Promise<AuditEntity> {
    const { diff, beforeRedacted, afterRedacted } = buildAuditSnapshotsAndDiff(
      payload.before,
      payload.after,
    );

    const { request } = this.requestContext.getStore() ?? {};
    const { url, method, headers } = request ?? {};

    return this.auditService.create({
      ...payload,
      actorType: ActorType.USER,
      source: SourceType.ADMIN_UI,
      domain: Domain.GAMES_AND_SOFTWARE,
      subDomain: SUB_DOMAIN.PLATFORM,
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
