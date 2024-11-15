import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationOptions } from 'src/library/dto/pagination.dto';

enum SORT_OPTIONS {
  CREATED = 'game.createdAt',
  RELEASE = 'game.release_date',
  NAME = 'game.name',
}

class GamePaginationOptions extends PaginationOptions {
  @ApiPropertyOptional({ enum: SORT_OPTIONS, default: SORT_OPTIONS.CREATED })
  @IsEnum(SORT_OPTIONS)
  @IsOptional()
  public readonly sort: SORT_OPTIONS = SORT_OPTIONS.CREATED;

  @ApiPropertyOptional()
  @IsBoolean()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @IsOptional()
  public readonly expanded?: boolean = false;

  @ApiPropertyOptional({ type: String, isArray: true })
  @IsArray()
  @IsOptional()
  public readonly platforms: Array<string> = [];

  @ApiPropertyOptional({ type: String, isArray: true })
  @IsArray()
  @IsOptional()
  public readonly genres: Array<string> = [];

  @ApiPropertyOptional({ type: String, isArray: true })
  @IsArray()
  @IsOptional()
  public readonly series: Array<string> = [];

  @ApiPropertyOptional({ type: String, isArray: true })
  @IsArray()
  @IsOptional()
  public readonly developers: Array<string> = [];

  @ApiPropertyOptional({ type: String, isArray: true })
  @IsArray()
  @IsOptional()
  public readonly publishers: Array<string> = [];

  @ApiPropertyOptional({ type: String, isArray: true })
  @IsArray()
  @IsOptional()
  public readonly gametypes: Array<string> = [];
}

class GameDto {
  @ApiProperty()
  @IsString()
  public readonly name!: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  public readonly release_date!: Date;

  @ApiProperty({ type: String, isArray: true })
  @IsOptional()
  public readonly platform_ids?: Array<string>;

  @ApiProperty({ type: String, isArray: true })
  @IsOptional()
  public readonly genre_ids?: Array<string>;

  @ApiProperty({ type: String, isArray: true })
  @IsOptional()
  public readonly series_ids?: Array<string>;

  @ApiProperty({ type: String, isArray: true })
  @IsOptional()
  public readonly developer_ids?: Array<string>;

  @ApiProperty({ type: String, isArray: true })
  @IsOptional()
  public readonly publisher_ids?: Array<string>;

  @ApiProperty({ type: String, isArray: true })
  @IsOptional()
  public readonly related_ids?: Array<string>;

  @ApiProperty()
  @IsString()
  public readonly gametype_id: string;

  @ApiProperty()
  @IsString()
  public readonly slug!: string;
}
export { GamePaginationOptions, GameDto };
