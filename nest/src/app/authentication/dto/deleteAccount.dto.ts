import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class deleteAccountDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public readonly password!: string;
}
