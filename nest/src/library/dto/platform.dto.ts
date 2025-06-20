import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { PaginationOptions } from 'src/library/dto/pagination.dto';

enum SORT_OPTIONS {
  CREATED = 'platform.createdAt',
  NAME = 'platform.name',
  RELEASE_DATE = 'platform.release_date',
}

class PlatformPaginationOptions extends PaginationOptions {
  @ApiPropertyOptional({ enum: SORT_OPTIONS, default: SORT_OPTIONS.CREATED })
  @IsEnum(SORT_OPTIONS)
  @IsOptional()
  public readonly sort: SORT_OPTIONS = SORT_OPTIONS.CREATED;
}

class CreatePlatformDto {
  @ApiProperty()
  @IsString()
  public readonly name!: string;

  @ApiProperty()
  @IsObject()
  @Type(() => Date)
  public readonly release_date!: Date;

  @ApiProperty()
  @IsString()
  public readonly slug!: string;
}

export { PlatformPaginationOptions, CreatePlatformDto };
