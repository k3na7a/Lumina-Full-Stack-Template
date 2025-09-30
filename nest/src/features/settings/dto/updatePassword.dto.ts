import { ApiProperty } from '@nestjs/swagger';

import { IsString, Matches } from 'class-validator';
import { Match } from 'src/common/validators/match.validator';
import { PasswordValidation } from '@lib/regex/validation.regex';

export class updatePasswordDto {
  @ApiProperty({
    description:
      "The user's current password, used to verify identity before changing it.",
    example: 'CurrentP@ssw0rd!',
  })
  @IsString()
  public readonly old_password!: string;

  @ApiProperty({
    description: 'The new password. Must meet complexity requirements.',
    example: 'N3wP@ssw0rd123!',
  })
  @IsString()
  @Matches(PasswordValidation.regex, {
    message: PasswordValidation.message,
  })
  public readonly new_password!: string;

  @ApiProperty({
    description:
      'Confirmation for the new password. Must match "new_password".',
    example: 'N3wP@ssw0rd123!',
  })
  @Match(updatePasswordDto, (s: updatePasswordDto) => s.new_password)
  public readonly confirm_new_password!: string;
}
