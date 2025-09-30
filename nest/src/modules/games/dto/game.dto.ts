import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationOptions } from 'src/common/dto/pagination.dto';

enum SORT_OPTIONS {
  CREATED = 'game.createdAt',
  NAME = 'game.name',
  RELEASE_DATE = 'game.release_date',
}

class GamePaginationOptions extends PaginationOptions {
  @ApiPropertyOptional({
    description: 'Sort order for the games list. Defaults to `CREATED`.',
    enum: SORT_OPTIONS,
    default: SORT_OPTIONS.CREATED,
    example: SORT_OPTIONS.CREATED,
  })
  @IsEnum(SORT_OPTIONS)
  @IsOptional()
  public readonly sort: SORT_OPTIONS = SORT_OPTIONS.CREATED;
}

class CreateGameDto {
  @ApiProperty({
    description: 'The name of the game.',
    example: 'The Legend of Zelda: Breath of the Wild',
  })
  @IsString()
  public readonly name!: string;

  @ApiProperty({
    description: 'The official release date of the game.',
    example: '2017-03-03T00:00:00.000Z',
  })
  @IsObject()
  @Type(() => Date)
  public readonly release_date!: Date;

  @ApiPropertyOptional({
    description: 'A brief description or summary of the game.',
    example: 'An open-world adventure game set in the kingdom of Hyrule.',
  })
  @IsOptional()
  @IsString()
  public readonly description?: string;

  @ApiProperty({
    description: 'A URL-friendly unique slug for the game.',
    example: 'the-legend-of-zelda-breath-of-the-wild',
  })
  @IsString()
  public readonly slug!: string;

  @ApiPropertyOptional({
    description: 'List of platform IDs or names the game is available on.',
    type: String,
    isArray: true,
    example: ['ztUmWA4SSFB8CaFIUPT5d', 'cOGgxhPtZWVtcTQPhAPLP'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') return [value];
    return value;
  })
  public readonly platforms: Array<string> = [];
}

export { CreateGameDto, GamePaginationOptions };
