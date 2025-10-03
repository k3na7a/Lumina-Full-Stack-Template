import { ApiProperty } from '@nestjs/swagger';
import { Warning, WarningDto } from './health.dto';
import { HealthIndicatorResult } from '@nestjs/terminus';

export class SystemOsDto {
  @ApiProperty({ example: 'linux', description: 'Operating system platform' })
  public readonly platform: string;

  @ApiProperty({
    example: '6.6.87.2-microsoft-standard-WSL2',
    description: 'Kernel version string',
  })
  public readonly kernel: string;

  @ApiProperty({ example: 'x64', description: 'CPU architecture' })
  public readonly arch: string;

  constructor(payload: SystemOsDto) {
    this.platform = payload.platform;
    this.kernel = payload.kernel;
    this.arch = payload.arch;
  }
}

export class SystemContainerDto {
  @ApiProperty({
    example: true,
    description: 'Whether the process is running inside a container',
  })
  public readonly inContainer: boolean;

  @ApiProperty({
    example: 'v2',
    enum: ['v1', 'v2', null],
    description: 'Cgroup version used by the container runtime, if applicable',
  })
  public readonly cgroupVersion: 'v1' | 'v2' | null;

  @ApiProperty({
    example: 'docker',
    nullable: true,
    description: 'Detected container runtime (docker, podman, k8s, etc.)',
  })
  public readonly runtimeHint: string | null;

  constructor(payload: SystemContainerDto) {
    this.inContainer = payload.inContainer;
    this.cgroupVersion = payload.cgroupVersion;
    this.runtimeHint = payload.runtimeHint;
  }
}

export class SystemHostDto {
  @ApiProperty({ example: 'my-host', description: 'Hostname of the system' })
  public readonly hostname: string;

  @ApiProperty({ type: () => SystemOsDto })
  public readonly os: SystemOsDto;

  @ApiProperty({ type: () => SystemContainerDto })
  public readonly container: SystemContainerDto;

  constructor(payload: SystemHostDto) {
    this.hostname = payload.hostname;
    this.os = new SystemOsDto(payload.os);
    this.container = new SystemContainerDto(payload.container);
  }
}

export class SystemRuntimeDto {
  @ApiProperty({ example: 'v20.19.5', description: 'Node.js runtime version' })
  public readonly node: string;

  @ApiProperty({
    example: '11.3.244.8-node.30',
    description: 'V8 engine version',
  })
  public readonly v8: string;

  @ApiProperty({
    example: '2.0.0',
    nullable: true,
    description: 'Application version string (from env)',
  })
  public readonly appVersion: string | null;

  @ApiProperty({
    example: 'abc123def',
    nullable: true,
    description: 'Git commit SHA for the running build',
  })
  public readonly gitSha: string | null;

  constructor(payload: SystemRuntimeDto) {
    this.node = payload.node;
    this.v8 = payload.v8;
    this.appVersion = payload.appVersion ?? null;
    this.gitSha = payload.gitSha ?? null;
  }
}

export class SystemCpuDto {
  @ApiProperty({
    example: 'AMD Ryzen 7 5800X 8-Core Processor',
    description: 'CPU model string',
  })
  public readonly model: string;

  @ApiProperty({
    example: 16,
    description: 'Total number of logical CPU cores',
  })
  public readonly logicalCores: number;

  @ApiProperty({
    example: 1,
    nullable: true,
    description: 'Cgroup CPU quota (cores) if limited, null otherwise',
  })
  public readonly quotaCores: number | null;

  @ApiProperty({
    example: true,
    description: 'Whether the CPU is limited by container quotas',
  })
  public readonly limited: boolean;

  @ApiProperty({
    example: [0.1, 0.05, 0.01],
    description: 'System load averages (1, 5, 15 min) or nulls on Windows',
  })
  public readonly loadAvg: (number | null)[];

  constructor(payload: SystemCpuDto) {
    this.model = payload.model;
    this.logicalCores = payload.logicalCores;
    this.quotaCores = payload.quotaCores ?? null;
    this.limited = payload.limited;
    this.loadAvg = payload.loadAvg;
  }
}

export class SystemMemoryDto {
  @ApiProperty({
    example: '32768.00',
    description: 'Total host memory in MB',
  })
  public readonly hostTotalMb: string | null;

  @ApiProperty({
    example: '2048.00',
    nullable: true,
    description: 'Cgroup memory limit in MB, if constrained',
  })
  public readonly cgroupLimitMb: string | null;

  @ApiProperty({
    example: '1024.00',
    nullable: true,
    description: 'Cgroup memory usage in MB, if constrained',
  })
  public readonly cgroupUsedMb: string | null;

  @ApiProperty({
    example: 50,
    nullable: true,
    description: 'Percent of cgroup memory used, null if unlimited',
  })
  public readonly cgroupUsedPct: number | null;

  @ApiProperty({ example: 512, description: 'Total swap space in MB' })
  public readonly swapTotalMb: number | null;

  @ApiProperty({ example: 128, description: 'Used swap space in MB' })
  public readonly swapUsedMb: number | null;

  constructor(payload: SystemMemoryDto) {
    this.hostTotalMb = payload.hostTotalMb;
    this.cgroupLimitMb = payload.cgroupLimitMb;
    this.cgroupUsedMb = payload.cgroupUsedMb;
    this.cgroupUsedPct = payload.cgroupUsedPct;
    this.swapTotalMb = payload.swapTotalMb;
    this.swapUsedMb = payload.swapUsedMb;
  }
}

export class SystemDiskDto {
  @ApiProperty({
    example: '/',
    description: 'Filesystem mount path',
  })
  public readonly diskPath: string;

  @ApiProperty({ example: 100000, description: 'Free space in MB' })
  public readonly freeMb: number;

  @ApiProperty({ example: 250000, description: 'Total disk size in MB' })
  public readonly sizeMb: number;

  @ApiProperty({ example: 150000, description: 'Used space in MB' })
  public readonly usedMb: number;

  constructor(payload: SystemDiskDto) {
    this.diskPath = payload.diskPath;
    this.freeMb = payload.freeMb;
    this.sizeMb = payload.sizeMb;
    this.usedMb = payload.usedMb;
  }
}

export class SystemLimitsDto {
  @ApiProperty({
    example: { soft: 1024, hard: 2048 },
    description: 'File descriptor (nofile) limits',
  })
  public readonly nofile: { soft: number | null; hard: number | null };

  @ApiProperty({
    example: 120,
    description: 'Number of currently open file descriptors',
  })
  public readonly openFds: number | null;

  constructor(payload: SystemLimitsDto) {
    this.nofile = payload.nofile;
    this.openFds = payload.openFds;
  }
}

export class SystemIfaceDto {
  @ApiProperty({ example: 'eth0', description: 'Interface name' })
  public readonly name: string;

  @ApiProperty({ example: ['192.168.0.10'], description: 'IPv4 addresses' })
  public readonly ipv4: string[];

  @ApiProperty({ example: ['fe80::1'], description: 'IPv6 addresses' })
  public readonly ipv6: string[];

  constructor(payload: SystemIfaceDto) {
    this.name = payload.name;
    this.ipv4 = payload.ipv4 ?? [];
    this.ipv6 = payload.ipv6 ?? [];
  }
}

export class SystemNetworkDto {
  @ApiProperty({
    example: '192.168.0.10',
    nullable: true,
    description: 'Primary external IPv4 address',
  })
  public readonly primaryIp: string | null;

  @ApiProperty({
    type: [SystemIfaceDto],
    description: 'List of network interfaces with addresses',
  })
  public readonly ifaces: SystemIfaceDto[];

  constructor(payload: SystemNetworkDto) {
    this.primaryIp = payload.primaryIp ?? null;
    this.ifaces = (payload.ifaces ?? []).map((i) => new SystemIfaceDto(i));
  }
}

export class SystemUptimeDto {
  @ApiProperty({
    example: 3600,
    description: 'Process uptime in seconds',
  })
  public readonly processSec: number;

  @ApiProperty({
    example: 86400,
    description: 'System uptime in seconds',
  })
  public readonly systemSec: number;

  constructor(payload: SystemUptimeDto) {
    this.processSec = payload.processSec;
    this.systemSec = payload.systemSec;
  }
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

  constructor(payload: SystemHealthDto) {
    this.host = new SystemHostDto(payload.host);
    this.runtime = new SystemRuntimeDto(payload.runtime);
    this.cpu = new SystemCpuDto(payload.cpu);
    this.memory = new SystemMemoryDto(payload.memory);
    this.disk = payload.disk ? new SystemDiskDto(payload.disk) : null;
    this.limits = new SystemLimitsDto(payload.limits);
    this.network = new SystemNetworkDto(payload.network);
    this.uptime = new SystemUptimeDto(payload.uptime);
    this.warnings = (payload.warnings ?? []).map((w) => new WarningDto(w));
  }
}

export type SystemHealthResult = HealthIndicatorResult<
  'system',
  'up',
  SystemHealthDto
>;

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
