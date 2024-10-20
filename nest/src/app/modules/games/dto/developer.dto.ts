import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationOptions } from 'src/library/dto/pagination.dto';

enum SORT_OPTIONS {
  CREATED = 'developer.createdAt',
  NAME = 'developer.name',
}

class DeveloperPaginationOptions extends PaginationOptions {
  @ApiPropertyOptional({ enum: SORT_OPTIONS, default: SORT_OPTIONS.CREATED })
  @IsEnum(SORT_OPTIONS)
  @IsOptional()
  public readonly sort: SORT_OPTIONS = SORT_OPTIONS.CREATED;
}

class DeveloperDto {
  @ApiProperty()
  @IsString()
  public readonly name!: string;

  @ApiProperty()
  @IsString()
  public readonly slug!: string;
}

export { DeveloperDto, DeveloperPaginationOptions };
