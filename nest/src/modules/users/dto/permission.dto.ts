import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PermissionDomain } from '@lib/constants/permissions.constants';
import { PaginationOptions } from 'src/common/dto/pagination.dto';

enum SORT_OPTIONS {
  CREATED = 'permission.createdAt',
  NAME = 'permission.name',
  LABEL = 'permission.label',
  DOMAIN = 'permission.domain',
}

export class PermissionPaginationOptions extends PaginationOptions {
  @ApiPropertyOptional({
    description: 'Sort order for the platform list. Defaults to `CREATED`.',
    enum: SORT_OPTIONS,
    default: SORT_OPTIONS.CREATED,
    example: SORT_OPTIONS.CREATED,
  })
  @IsEnum(SORT_OPTIONS)
  @IsOptional()
  public readonly sort: SORT_OPTIONS = SORT_OPTIONS.CREATED;
}

export class CreatePermissionDto {
  @ApiProperty({
    description: 'Machine-readable key.',
    example: 'has_all',
  })
  @IsString()
  public readonly name: string;

  @ApiProperty({
    description: 'Domain is a logical grouping for your permissions.',
    example: PermissionDomain.SYSTEM,
  })
  @IsEnum(PermissionDomain)
  public readonly domain: PermissionDomain;

  @ApiProperty({
    description: 'Human-readable label for the permission.',
    example: 'Has All',
  })
  @IsString()
  public readonly label: string;

  @ApiProperty({
    description: 'Description of the permission.',
    example: 'Has full access to all resources.',
  })
  @IsString()
  public readonly description?: string;

  @ApiProperty({
    description:
      'Is this a system permission that should be protected from deletion?',
    example: false,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') return [value];
    return value;
  })
  @IsBoolean()
  @IsOptional()
  public readonly isSystemPermission: boolean;
}
