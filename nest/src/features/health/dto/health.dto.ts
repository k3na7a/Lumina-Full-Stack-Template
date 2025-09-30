import { ApiProperty } from '@nestjs/swagger';
import { HealthIndicatorResult, HealthIndicatorStatus } from '@nestjs/terminus';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok' })
  public readonly status: string;

  @ApiProperty()
  public readonly services: services;

  @ApiProperty({ example: 1725116400000 })
  public readonly timestamp: number;

  constructor(raw: { status: string; details: services }) {
    this.status = raw.status;
    this.services = raw.details;
    this.timestamp = new Date().getTime();
  }
}

export type services =
  | { [x: string]: { status: HealthIndicatorStatus } & Record<string, any> }
  | { system: HealthIndicatorResult<'system', 'up', isystemhealth> };

export interface isystemhealth {
  host: {
    hostname: string;
    os: {
      platform: string;
      kernel: string;
      arch: string;
    };
    container: {
      inContainer: boolean;
      cgroupVersion: 'v2' | 'v1' | null;
      runtimeHint: string | null;
    };
  };
  runtime: {
    node: string;
    v8: string;
    appVersion: string | null;
    gitSha: string | null;
  };
  cpu: {
    model: string;
    logicalCores: number;
    quotaCores: number | null;
    limited: boolean;
    loadAvg: null[] | number[];
  };
  memory: {
    hostTotalMb: string | null;
    cgroupLimitMb: string | null;
    cgroupUsedMb: string | null;
    cgroupUsedPct: number | null;
    swapTotalMb: number | null;
    swapUsedMb: number | null;
  };
  disk: {
    diskPath: string;
    freeMb: number;
    sizeMb: number;
    usedMb: number;
  } | null;
  limits: {
    nofile: {
      soft: number | null;
      hard: number | null;
    };
    openFds: number | null;
  };
  network: {
    primaryIp: string | null;
    ifaces: {
      name: string;
      ipv4: string[];
      ipv6: string[];
    }[];
  };
  uptime: {
    processSec: number;
    systemSec: number;
  };
}

export interface SystemHealthResult extends HealthIndicatorResult {
  system: {
    status: HealthIndicatorStatus;
  } & isystemhealth;
}
