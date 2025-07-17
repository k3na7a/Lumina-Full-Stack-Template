import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { PaginationOptions } from 'src/app/common/dto/pagination.dto';

enum SORT_OPTIONS {
  CREATED = 'user.createdAt',
  LAST_NAME = 'profile.name.last',
}

class UserPaginationOptions extends PaginationOptions {
  @ApiPropertyOptional({
    description: 'Sort order for the users list. Defaults to `CREATED`.',
    enum: SORT_OPTIONS,
    default: SORT_OPTIONS.CREATED,
    example: SORT_OPTIONS.CREATED,
  })
  @IsEnum(SORT_OPTIONS)
  @IsOptional()
  public readonly sort: SORT_OPTIONS = SORT_OPTIONS.CREATED;
}

class UpdateUserDto {
  @ApiProperty({
    description: "The user's first name.",
    example: 'Jane',
  })
  @IsString()
  public readonly firstname: string;

  @ApiProperty({
    description: "The user's last name.",
    example: 'Doe',
  })
  @IsString()
  public readonly lastname: string;

  @ApiProperty({
    description: "The user's email address.",
    example: 'jane.doe@example.com',
  })
  @IsString()
  public readonly email: string;

  @ApiPropertyOptional({
    description: "Delete user's profile picture?",
    example: false,
  })
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @IsBoolean()
  @IsOptional()
  public readonly 'remove-avatar'?: boolean;

  @ApiPropertyOptional({
    description: 'List of role IDs available to the user.',
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
  public readonly roles: Array<string> = [];
}

export { UserPaginationOptions, UpdateUserDto };
