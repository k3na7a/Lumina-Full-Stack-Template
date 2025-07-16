import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Machine-readable key.',
    example: 'ADMINISTRATOR',
  })
  @IsString()
  public readonly name: string;

  @ApiProperty({
    description: 'Human-friendly name.',
    example: 'Administrator',
  })
  @IsString()
  public readonly label: string;

  @ApiProperty({
    description: 'Description of the role.',
    example: 'Has full access to all resources.',
  })
  @IsString()
  public readonly description?: string;

  @ApiProperty({
    description:
      'Is this a system role that should be protected from deletion?',
    example: false,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') return [value];
    return value;
  })
  @IsBoolean()
  @IsOptional()
  public readonly isSystemRole: boolean;

  @ApiPropertyOptional({
    description: 'List of permission IDs available to the role.',
    type: String,
    isArray: true,
    example: ['ztUmWA4SSFB8CaFIUPT5d', 'cOGgxhPtZWVtcTQPhAPLP'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') return [value];
    return value;
  })
  public readonly permissions: Array<string> = [];
}
