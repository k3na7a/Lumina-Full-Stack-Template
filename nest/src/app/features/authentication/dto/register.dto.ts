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

export class CreateUserNameDto {
  @ApiProperty({
    description: "The user's first name.",
    example: 'Jane',
  })
  @IsString()
  @IsNotEmpty()
  public first!: string;

  @ApiProperty({
    description: "The user's last name.",
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  public last!: string;
}

export class RegisterProfileDto {
  @ApiProperty({
    description: "The user's name details.",
    type: () => CreateUserNameDto,
  })
  @IsDefined()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateUserNameDto)
  public name!: CreateUserNameDto;
}

export class RegisterDto {
  @ApiProperty({
    description: "The user's email address.",
    example: 'jane.doe@example.com',
  })
  @IsEmail()
  public readonly email!: string;

  @ApiProperty({
    description: "The user's password, must meet complexity requirements.",
    example: 'P@ssw0rd123!',
  })
  @IsString()
  @Matches(PasswordValidation.regex, {
    message: PasswordValidation.message,
  })
  public readonly password!: string;

  @ApiProperty({
    description: 'Profile details for the new user.',
    type: () => RegisterProfileDto,
  })
  @IsDefined()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => RegisterProfileDto)
  public profile!: RegisterProfileDto;
}
