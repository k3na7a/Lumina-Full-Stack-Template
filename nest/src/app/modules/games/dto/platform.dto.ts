import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationOptions } from 'src/library/dto/pagination.dto';

enum SORT_OPTIONS {
  CREATED = 'platform.createdAt',
  RELEASE = 'platform.release_date',
}

class PlatformPaginationOptions extends PaginationOptions {
  @ApiPropertyOptional({ enum: SORT_OPTIONS, default: SORT_OPTIONS.RELEASE })
  @IsEnum(SORT_OPTIONS)
  @IsOptional()
  public readonly sort: SORT_OPTIONS = SORT_OPTIONS.RELEASE;
}

class PlatformDto {
  @ApiProperty()
  @IsString()
  public readonly name!: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  public readonly release_date!: Date;

  @ApiProperty()
  @IsString()
  public readonly abbreviation!: string;

  @ApiProperty()
  @IsString()
  public readonly slug!: string;
}

export { PlatformDto, PlatformPaginationOptions };
