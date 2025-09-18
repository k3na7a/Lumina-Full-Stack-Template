import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  PaginationDto,
  PaginationMeta,
} from 'src/app/common/dto/pagination.dto';

import { AuditEntity } from '../entities/audit.entity';
import { AuditPaginationOptions } from '../dto/audit.dto';
import { RequestContext } from 'src/app/common/providers/request-context.provider';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditEntity)
    private readonly repository: Repository<AuditEntity>,
    public readonly requestContext: RequestContext,
  ) {}

  public async create(dto: Partial<AuditEntity>): Promise<AuditEntity> {
    const req = this.requestContext.getStore();
    const platform = this.repository.create({
      requestId: req?.requestId,
      actorId: req?.userId,
      actorIp: req?.ipAddress,
      actorUa: req?.userAgent,
      ...dto,
    });
    return this.repository.save(platform);
  }

  public async paginate(
    pageOptions: AuditPaginationOptions,
  ): Promise<PaginationDto<AuditEntity>> {
    const { sort, order, take, skip, domain } = pageOptions;
    const [platforms, itemCount] = await this.repository
      .createQueryBuilder('audit_event')
      .where(':domain IS NULL OR audit_event.domain = :domain', {
        domain: domain ?? null,
      })
      .orderBy({ [sort]: order })
      .take(take)
      .skip(skip)
      .getManyAndCount();

    const meta = new PaginationMeta({ pageOptions, itemCount });
    return new PaginationDto(platforms, meta);
  }
}
