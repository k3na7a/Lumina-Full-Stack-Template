import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

import { Match } from 'src/library/validators/match.validator';

export class updateEmailDto {
  @ApiProperty({
    description:
      "The user's current password, required to authorize the email change.",
    example: 'CurrentP@ssword123!',
  })
  @IsString()
  public readonly password!: string;

  @ApiProperty({
    description:
      'The new email address you want to associate with your account.',
    example: 'new.email@example.com',
  })
  @IsEmail()
  public readonly new_email!: string;

  @ApiProperty({
    description:
      'Confirmation for the new email address. Must match "new_email".',
    example: 'new.email@example.com',
  })
  @Match(updateEmailDto, (s: updateEmailDto) => s.new_email)
  public readonly confirm_new_email!: string;
}
