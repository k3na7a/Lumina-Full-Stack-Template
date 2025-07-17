import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

import { Match } from 'src/app/common/validators/match.validator';
import { PasswordValidation } from '@lib/regex/validation.regex';

class ResetPasswordDto {
  @ApiProperty({
    description: 'The new password. Must meet complexity requirements.',
    example: 'N3wP@ssword123!',
  })
  @IsString()
  @Matches(PasswordValidation.regex, {
    message: PasswordValidation.message,
  })
  public readonly new_password!: string;

  @ApiProperty({
    description:
      'Confirmation for the new password. Must match `new_password`.',
    example: 'N3wP@ssword123!',
  })
  @Match(ResetPasswordDto, (s: ResetPasswordDto) => s.new_password)
  public readonly confirm_password!: string;
}

export { ResetPasswordDto };
