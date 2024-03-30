import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

import { Match } from '../decorators/match.decorator';
import { PasswordValidation } from 'src/library/regex/validation.regex';

class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @Matches(PasswordValidation.regex, {
    message: PasswordValidation.message,
  })
  public new_password: string;

  @ApiProperty()
  @Match(ResetPasswordDto, (s: ResetPasswordDto) => s.new_password)
  public confirm_password: string;
}

export { ResetPasswordDto };
