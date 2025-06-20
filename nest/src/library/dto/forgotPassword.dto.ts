import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsUrl } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty()
  @IsEmail()
  public readonly email!: string;

  @ApiProperty()
  @IsUrl({ require_tld: false }) // https://github.com/validatorjs/validator.js/issues/1609#issuecomment-780685689
  public readonly redirect!: string;
}
