import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PermissionDomain } from 'src/library/constants/permissions.constants';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'Machine-readable key.',
    example: 'has_all',
  })
  @IsString()
  public readonly name: string;

  @ApiProperty({
    description: 'Domain is a logical grouping for your permissions.',
    example: PermissionDomain.SYSTEM,
  })
  @IsEnum(PermissionDomain)
  public readonly domain: PermissionDomain;

  @ApiProperty({
    description: 'Human-readable label for the permission.',
    example: 'Has All',
  })
  @IsString()
  public readonly label: string;

  @ApiProperty({
    description: 'Description of the permission.',
    example: 'Has full access to all resources.',
  })
  @IsString()
  public readonly description?: string;

  @ApiProperty({
    description:
      'Is this a system permission that should be protected from deletion?',
    example: false,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') return [value];
    return value;
  })
  @IsBoolean()
  @IsOptional()
  public readonly isSystemPermission: boolean;
}
