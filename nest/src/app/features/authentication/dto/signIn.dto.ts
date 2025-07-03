import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'The email address associated with the user account.',
    example: 'jane.doe@example.com',
  })
  @IsEmail()
  public readonly email!: string;

  @ApiProperty({
    description: "The user's password.",
    example: 'P@ssw0rd123!',
  })
  @IsString()
  @IsNotEmpty()
  public readonly password!: string;
}
