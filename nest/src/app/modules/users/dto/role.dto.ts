import { IsArray, IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PaginationOptions } from 'src/app/common/dto/pagination.dto';

enum SORT_OPTIONS {
  CREATED = 'role.createdAt',
  NAME = 'role.name',
  LABEL = 'role.label',
}

export class RolePaginationOptions extends PaginationOptions {
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

export class CreateRoleDto {
  @ApiProperty({
    description: 'Machine-readable key.',
    example: 'ADMINISTRATOR',
  })
  @IsString()
  public readonly name: string;

  @ApiProperty({
    description: 'Human-friendly name.',
    example: 'Administrator',
  })
  @IsString()
  public readonly label: string;

  @ApiProperty({
    description: 'Description of the role.',
    example: 'Has full access to all resources.',
  })
  @IsString()
  public readonly description?: string;

  @ApiProperty({
    description:
      'Is this a system role that should be protected from deletion?',
    example: false,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') return [value];
    return value;
  })
  @IsBoolean()
  @IsOptional()
  public readonly isSystemRole: boolean;

  @ApiPropertyOptional({
    description: 'List of permission IDs available to the role.',
    type: String,
    isArray: true,
    example: ['ztUmWA4SSFB8CaFIUPT5d', 'cOGgxhPtZWVtcTQPhAPLP'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value) ? value : String(value).split(','),
  )
  public readonly permissions: Array<string> = [];
}
