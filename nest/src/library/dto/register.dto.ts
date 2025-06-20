import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';

import { PasswordValidation } from 'src/library/regex/password-validation.regex';

class CreateUserNameDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public first!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public last!: string;
}

export class RegisterProfileDto {
  @ApiProperty()
  @IsDefined()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateUserNameDto)
  public name!: CreateUserNameDto;
}

export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  public readonly email!: string;

  @ApiProperty()
  @IsString()
  @Matches(PasswordValidation.regex, {
    message: PasswordValidation.message,
  })
  public readonly password!: string;

  @ApiProperty()
  @IsDefined()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => RegisterProfileDto)
  public profile!: RegisterProfileDto;
}
