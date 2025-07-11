import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { PaginationOptions } from 'src/library/dto/pagination.dto';

enum SORT_OPTIONS {
  CREATED = 'platform.createdAt',
  NAME = 'platform.name',
  RELEASE_DATE = 'platform.release_date',
  GAME_COUNT = 'gameCount',
}

class PlatformPaginationOptions extends PaginationOptions {
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

class CreatePlatformDto {
  @ApiProperty({
    description: 'The name of the platform.',
    example: 'Nintendo Switch',
  })
  @IsString()
  public readonly name!: string;

  @ApiProperty({
    description: 'The official release date of the platform.',
    example: '2017-03-03T00:00:00.000Z',
  })
  @IsObject()
  @Type(() => Date)
  public readonly release_date!: Date;

  @ApiProperty({
    description: 'A URL-friendly unique slug for the platform.',
    example: 'nintendo-switch',
  })
  @IsString()
  public readonly slug!: string;
}

export { PlatformPaginationOptions, CreatePlatformDto };
