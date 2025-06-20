import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Role } from 'src/library/enums/role.enum';
import { PaginationOptions } from 'src/library/dto/pagination.dto';

enum SORT_OPTIONS {
  CREATED = 'user.createdAt',
  LAST_NAME = 'profile.name.last',
}

class UserPaginationOptions extends PaginationOptions {
  @ApiPropertyOptional({ enum: SORT_OPTIONS, default: SORT_OPTIONS.CREATED })
  @IsEnum(SORT_OPTIONS)
  @IsOptional()
  public readonly sort: SORT_OPTIONS = SORT_OPTIONS.CREATED;
}

class UpdateUserDto {
  @ApiProperty()
  @IsString()
  public readonly firstname: string;
  @ApiProperty()
  @IsString()
  public readonly lastname: string;
  @ApiProperty()
  @IsString()
  public readonly email: string;
  @ApiProperty()
  @IsEnum(Role)
  public readonly role: Role;
}

export { UserPaginationOptions, UpdateUserDto };
