import { IsEnum, IsOptional } from 'class-validator';
import { PaginationOptions } from './pagination.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

enum SORT_OPTIONS {
  CREATED = 'user.createdAt',
  LAST_NAME = 'profile.name.last',
}

export class UserPaginationOptions extends PaginationOptions {
  @ApiPropertyOptional({ enum: SORT_OPTIONS, default: SORT_OPTIONS.CREATED })
  @IsEnum(SORT_OPTIONS)
  @IsOptional()
  readonly sort: SORT_OPTIONS = SORT_OPTIONS.CREATED;
}
