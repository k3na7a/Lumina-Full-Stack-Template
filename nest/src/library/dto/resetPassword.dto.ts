import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

import { Match } from '../../app/authentication/decorators/match.decorator';
import { PasswordValidation } from 'src/library/regex/validation.regex';

class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @Matches(PasswordValidation.regex, {
    message: PasswordValidation.message,
  })
  public readonly new_password!: string;

  @ApiProperty()
  @Match(ResetPasswordDto, (s: ResetPasswordDto) => s.new_password)
  public readonly confirm_password!: string;
}

export { ResetPasswordDto };
