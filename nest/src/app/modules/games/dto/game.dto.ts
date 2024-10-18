import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationOptions } from 'src/library/dto/pagination.dto';

enum SORT_OPTIONS {
  CREATED = 'game.createdAt',
  RELEASE = 'game.release_date',
}

class GamePaginationOptions extends PaginationOptions {
  @ApiPropertyOptional({ enum: SORT_OPTIONS, default: SORT_OPTIONS.CREATED })
  @IsEnum(SORT_OPTIONS)
  @IsOptional()
  public readonly sort: SORT_OPTIONS = SORT_OPTIONS.CREATED;
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

  @ApiProperty()
  @IsString()
  public readonly slug!: string;
}
export { GamePaginationOptions, GameDto };
