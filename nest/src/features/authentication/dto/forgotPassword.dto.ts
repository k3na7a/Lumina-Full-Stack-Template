import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsUrl } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description:
      'Email address associated with the user account. A password reset link will be sent to this email.',
    example: 'user@example.com',
  })
  @IsEmail()
  public readonly email!: string;

  @ApiProperty({
    description:
      'URL to redirect the user to after successfully resetting the password. Useful for mobile or web clients.',
    example: 'https://yourapp.com/reset-success',
  })
  @IsUrl({ require_tld: false }) // https://github.com/validatorjs/validator.js/issues/1609#issuecomment-780685689
  public readonly redirect!: string;
}
