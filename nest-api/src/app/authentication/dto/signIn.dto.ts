import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty()
  @IsEmail()
  public email!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public password!: string;
}
