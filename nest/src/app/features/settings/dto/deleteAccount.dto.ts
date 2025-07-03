import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class deleteAccountDto {
  @ApiProperty({
    description:
      'The user’s current password for verifying identity before account deletion.',
    example: 'MySecureP@ssw0rd!',
  })
  @IsString()
  @IsNotEmpty()
  public readonly password!: string;
}
