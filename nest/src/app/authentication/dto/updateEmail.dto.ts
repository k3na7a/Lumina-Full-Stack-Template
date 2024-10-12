import { ApiProperty } from '@nestjs/swagger';
import { Match } from '../decorators/match.decorator';
import { IsEmail, IsString } from 'class-validator';

export class updateEmailDto {
  @ApiProperty()
  @IsString()
  public readonly password!: string;

  @ApiProperty()
  @IsEmail()
  public readonly new_email!: string;

  @ApiProperty()
  @Match(updateEmailDto, (s: updateEmailDto) => s.new_email)
  public readonly confirm_new_email!: string;
}
