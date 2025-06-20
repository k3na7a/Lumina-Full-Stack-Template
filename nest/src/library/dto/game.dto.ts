import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { PaginationOptions } from 'src/library/dto/pagination.dto';

enum SORT_OPTIONS {
  CREATED = 'game.createdAt',
  NAME = 'game.name',
  RELEASE_DATE = 'game.release_date',
}

class GamePaginationOptions extends PaginationOptions {
  @ApiPropertyOptional({ enum: SORT_OPTIONS, default: SORT_OPTIONS.CREATED })
  @IsEnum(SORT_OPTIONS)
  @IsOptional()
  public readonly sort: SORT_OPTIONS = SORT_OPTIONS.CREATED;
}

class CreateGameDto {
  @ApiProperty()
  @IsString()
  public readonly name!: string;

  @ApiProperty()
  @IsObject()
  @Type(() => Date)
  public readonly release_date!: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public readonly description?: string;

  @ApiProperty()
  @IsString()
  public readonly slug!: string;
}

export { CreateGameDto, GamePaginationOptions };
