import { ApiProperty } from '@nestjs/swagger';
import { HealthCheckResult } from '@nestjs/terminus';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok' })
  public readonly status: string;

  @ApiProperty({
    example: {
      redis: {
        status: 'up',
      },
      database: {
        status: 'up',
      },
    },
  })
  public readonly services: Record<string, any>;

  @ApiProperty({ example: 1725116400000 })
  public readonly timestamp: number;

  constructor(raw: HealthCheckResult) {
    this.status = raw.status;
    this.services = raw.details;
    this.timestamp = new Date().getTime();
  }
}
