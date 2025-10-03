import { ApiProperty } from '@nestjs/swagger';
import { Warning, WarningDto } from './health.dto';
import { HealthIndicatorResult } from '@nestjs/terminus';

export class SystemOsDto {
  @ApiProperty({ example: 'linux' })
  public readonly platform: string;
  @ApiProperty({ example: '6.6.87.2-microsoft-standard-WSL2' })
  public readonly kernel: string;
  @ApiProperty({ example: 'x64' })
  public readonly arch: string;
}

export class SystemContainerDto {
  @ApiProperty({ example: true })
  public readonly inContainer: boolean;
  @ApiProperty({ example: 'v2', enum: ['v1', 'v2', null] })
  public readonly cgroupVersion: 'v1' | 'v2' | null;
  @ApiProperty({ example: 'docker', nullable: true })
  public readonly runtimeHint: string | null;
}

export class SystemHostDto {
  @ApiProperty({ example: 'my-host' })
  public readonly hostname: string;
  @ApiProperty({ type: () => SystemOsDto })
  public readonly os: SystemOsDto;
  @ApiProperty({ type: () => SystemContainerDto })
  public readonly container: SystemContainerDto;
}

export class SystemRuntimeDto {
  @ApiProperty({ example: 'v20.19.5' })
  public readonly node: string;
  @ApiProperty({ example: '11.3.244.8-node.30' })
  public readonly v8: string;
  @ApiProperty({ example: '2.0.0', nullable: true })
  public readonly appVersion: string | null;
  @ApiProperty({ example: 'abc123def', nullable: true })
  public readonly gitSha: string | null;
}

export class SystemCpuDto {
  @ApiProperty({ example: 'AMD Ryzen 7 5800X 8-Core Processor' }) model: string;
  @ApiProperty({ example: 16 }) logicalCores: number;
  @ApiProperty({ example: 1, nullable: true })
  public readonly quotaCores: number | null;
  @ApiProperty({ example: true })
  public readonly limited: boolean;
  @ApiProperty({ example: [0.1, 0.05, 0.01] })
  public readonly loadAvg: (number | null)[];
}

export class SystemMemoryDto {
  @ApiProperty({ example: '32768.00' }) hostTotalMb: string | null;
  @ApiProperty({ example: '2048.00', nullable: true })
  public readonly cgroupLimitMb: string | null;
  @ApiProperty({ example: '1024.00', nullable: true })
  public readonly cgroupUsedMb: string | null;
  @ApiProperty({ example: 50, nullable: true })
  public readonly cgroupUsedPct: number | null;
  @ApiProperty({ example: 512 })
  public readonly swapTotalMb: number | null;
  @ApiProperty({ example: 128 })
  public readonly swapUsedMb: number | null;
}

export class SystemDiskDto {
  @ApiProperty({ example: '/' })
  public readonly diskPath: string;
  @ApiProperty({ example: 100000 })
  public readonly freeMb: number;
  @ApiProperty({ example: 250000 })
  public readonly sizeMb: number;
  @ApiProperty({ example: 150000 })
  public readonly usedMb: number;
}

export class SystemLimitsDto {
  @ApiProperty({ example: { soft: 1024, hard: 2048 } })
  public readonly nofile: { soft: number | null; hard: number | null };
  @ApiProperty({ example: 120 })
  public readonly openFds: number | null;
}

export class SystemIfaceDto {
  @ApiProperty({ example: 'eth0' })
  public readonly name: string;
  @ApiProperty({ example: ['192.168.0.10'] })
  public readonly ipv4: string[];
  @ApiProperty({ example: ['fe80::1'] })
  public readonly ipv6: string[];
}

export class SystemNetworkDto {
  @ApiProperty({ example: '192.168.0.10', nullable: true })
  public readonly primaryIp: string | null;
  @ApiProperty({ type: [SystemIfaceDto] })
  public readonly ifaces: SystemIfaceDto[];
}

export class SystemUptimeDto {
  @ApiProperty({ example: 3600 })
  public readonly processSec: number;
  @ApiProperty({ example: 86400 })
  public readonly systemSec: number;
}

export class SystemHealthDto {
  @ApiProperty({ type: () => SystemHostDto })
  public readonly host: SystemHostDto;
  @ApiProperty({ type: () => SystemRuntimeDto })
  public readonly runtime: SystemRuntimeDto;
  @ApiProperty({ type: () => SystemCpuDto })
  public readonly cpu: SystemCpuDto;
  @ApiProperty({ type: () => SystemMemoryDto })
  public readonly memory: SystemMemoryDto;
  @ApiProperty({ type: () => SystemDiskDto, nullable: true })
  public readonly disk: SystemDiskDto | null;
  @ApiProperty({ type: () => SystemLimitsDto })
  public readonly limits: SystemLimitsDto;
  @ApiProperty({ type: () => SystemNetworkDto })
  public readonly network: SystemNetworkDto;
  @ApiProperty({ type: () => SystemUptimeDto })
  public readonly uptime: SystemUptimeDto;
  @ApiProperty({ type: [WarningDto] })
  public readonly warnings: WarningDto[];
}

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
  warnings: Warning[];
}

export type SystemServiceHealth =
  | ({ status: 'up' } & isystemhealth)
  | { status: 'down'; reason: string };

export type SystemHealthResult = HealthIndicatorResult<
  'system',
  'up',
  isystemhealth
>;
