import { ApiProperty } from '@nestjs/swagger';

import { IsString, Matches } from 'class-validator';
import { Match } from 'src/library/validators/match.validator';
import { PasswordValidation } from 'src/library/regex/password-validation.regex';

export class updatePasswordDto {
  @ApiProperty()
  @IsString()
  public readonly old_password!: string;

  @ApiProperty()
  @IsString()
  @Matches(PasswordValidation.regex, {
    message: PasswordValidation.message,
  })
  public readonly new_password!: string;

  @ApiProperty()
  @Match(updatePasswordDto, (s: updatePasswordDto) => s.new_password)
  public readonly confirm_new_password!: string;
}
