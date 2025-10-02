import { Injectable } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';
import * as os from 'os';
import { promises as fs } from 'fs';

import { useFileManager } from '../utilities/fileManager.util';
import checkDiskSpace, { DiskSpace } from 'check-disk-space';
import { getRootPath } from 'src/common/utilities/path.util';
import { megabyte } from '@lib/constants/size.constants';
import { isystemhealth, Warning } from 'src/features/health/dto/health.dto';

@Injectable()
export class SystemHealthIndicator {
  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async previewSystem<K extends string = 'system'>(
    key: K = 'system' as K,
  ): Promise<HealthIndicatorResult<K, 'up', isystemhealth>> {
    const indicator = this.healthIndicatorService.check(key);
    const { readFile } = useFileManager();

    const isLinux = os.platform() === 'linux';
    const isWindows = os.platform() === 'win32';

    function fileExists(path: string): boolean {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return !!readFile(path) || require('fs').existsSync(path);
      } catch {
        return false;
      }
    }

    function detectContainer(): {
      readonly inContainer: boolean;
      readonly cgroupVersion: 'v2' | 'v1' | null;
      readonly runtimeHint:
        | 'docker'
        | 'podman'
        | 'k8s'
        | 'containerd'
        | 'lxc'
        | 'garden'
        | null;
    } {
      if (!isLinux)
        return {
          inContainer: false,
          cgroupVersion: null,
          runtimeHint: null,
        } as const;

      if (fileExists('/.dockerenv')) {
        const cgv2 = readFile('/sys/fs/cgroup/cgroup.controllers');
        return {
          inContainer: true,
          cgroupVersion: cgv2 != null ? 'v2' : 'v1',
          runtimeHint: 'docker',
        } as const;
      }

      if (fileExists('/run/.containerenv')) {
        const cgv2 = readFile('/sys/fs/cgroup/cgroup.controllers');
        return {
          inContainer: true,
          cgroupVersion: cgv2 != null ? 'v2' : 'v1',
          runtimeHint: 'podman',
        } as const;
      }

      const cg1 = readFile('/proc/1/cgroup') || '';
      const cgSelf = readFile('/proc/self/cgroup') || '';
      const cgroupBlob = `${cg1}\n${cgSelf}`;

      const hint =
        (/kubepods/i.test(cgroupBlob) && 'k8s') ||
        (/docker/i.test(cgroupBlob) && 'docker') ||
        (/containerd/i.test(cgroupBlob) && 'containerd') ||
        (/libpod|podman/i.test(cgroupBlob) && 'podman') ||
        (/lxc/i.test(cgroupBlob) && 'lxc') ||
        (/garden/i.test(cgroupBlob) && 'garden') ||
        null;

      const cgv2 = readFile('/sys/fs/cgroup/cgroup.controllers');
      if (hint)
        return {
          inContainer: true,
          cgroupVersion: cgv2 != null ? 'v2' : 'v1',
          runtimeHint: hint,
        } as const;

      const memMax = readFile('/sys/fs/cgroup/memory.max');

      let limited = false;
      if (memMax && memMax !== 'max') {
        const hostTotal = os.totalmem();
        const limit = Number(memMax);
        if (Number.isFinite(limit) && limit > 0 && limit < hostTotal)
          limited = true;
      }

      const cpuMax = readFile('/sys/fs/cgroup/cpu.max');
      if (cpuMax && cpuMax !== 'max') limited = true;

      if (limited)
        return {
          inContainer: true,
          cgroupVersion: cgv2 != null ? 'v2' : 'v1',
          runtimeHint: null,
        } as const;

      return {
        inContainer: false,
        cgroupVersion: cgv2 != null ? 'v2' : 'v1',
        runtimeHint: null,
      } as const;
    }

    function readCgroupCpu(): {
      readonly quotaCores: number | null;
    } {
      if (!isLinux) return { quotaCores: null } as const;

      const cpuMax = readFile('/sys/fs/cgroup/cpu.max');
      if (cpuMax) {
        const [quotaStr, periodStr] = cpuMax.split(/\s+/);
        if (quotaStr !== 'max') {
          const quota = Number(quotaStr),
            period = Number(periodStr);
          if (quota > 0 && period > 0)
            return { quotaCores: quota / period } as const;
        }
        return { quotaCores: null } as const;
      }

      const quotaUs = Number(readFile('/sys/fs/cgroup/cpu/cpu.cfs_quota_us'));
      const periodUs = Number(readFile('/sys/fs/cgroup/cpu/cpu.cfs_period_us'));

      if (quotaUs && periodUs && quotaUs > 0)
        return { quotaCores: quotaUs / periodUs } as const;

      return { quotaCores: null } as const;
    }

    function readCgroupMemory(): {
      readonly limitBytes: number | null;
      readonly usedBytes: number | null;
    } {
      if (!isLinux) return { limitBytes: null, usedBytes: null };

      const maxV2 = readFile('/sys/fs/cgroup/memory.max');
      const curV2 = Number(readFile('/sys/fs/cgroup/memory.current'));

      if (maxV2 !== null && curV2 !== null) {
        const limitBytes = maxV2 === 'max' ? null : Number(maxV2);
        return { limitBytes, usedBytes: curV2 } as const;
      }

      const limitV1 = Number(
        readFile('/sys/fs/cgroup/memory/memory.limit_in_bytes'),
      );

      const usedV1 = Number(
        readFile('/sys/fs/cgroup/memory/memory.usage_in_bytes'),
      );

      return { limitBytes: limitV1, usedBytes: usedV1 } as const;
    }

    function readSystemUptimeSec(): number {
      if (!isLinux) return Math.floor(os.uptime());

      const txt = readFile('/proc/uptime');
      if (!txt) return Math.floor(os.uptime());

      const first = Number(txt.split(' ')[0]);
      return Math.floor(Number.isFinite(first) ? first : os.uptime());
    }

    function getPrimaryIp(): string | null {
      const ifs = os.networkInterfaces();

      for (const name of Object.keys(ifs)) {
        for (const addr of ifs[name] || []) {
          if (addr.family === 'IPv4' && !addr.internal) return addr.address;
        }
      }

      return null;
    }

    function ifaceList(): {
      name: string;
      ipv4: string[];
      ipv6: string[];
    }[] {
      const ifs = os.networkInterfaces();
      return Object.entries(ifs).map(([name, addrs]) => ({
        name,
        ipv4: (addrs || [])
          .filter((a) => a.family === 'IPv4')
          .map((a) => a.address),
        ipv6: (addrs || [])
          .filter((a) => a.family === 'IPv6')
          .map((a) => a.address),
      }));
    }

    function readSwapTotalMb(): number | null {
      if (!isLinux) return null;

      const txt = readFile('/proc/meminfo');
      if (!txt) return 0;

      const line = txt.split('\n').find((l) => l.startsWith('SwapTotal:'));
      if (!line) return 0;

      const kb = Number(line.replace(/[^0-9]/g, '')) || 0;
      return Number((kb / 1024).toFixed(2));
    }

    function readSwapUsedMb(): number | null {
      if (!isLinux) return null;

      const txt = readFile('/proc/meminfo');
      if (!txt) return 0;

      const tot =
        Number(
          (
            txt.split('\n').find((l) => l.startsWith('SwapTotal:')) || ''
          ).replace(/[^0-9]/g, ''),
        ) || 0;

      const free =
        Number(
          (
            txt.split('\n').find((l) => l.startsWith('SwapFree:')) || ''
          ).replace(/[^0-9]/g, ''),
        ) || 0;

      const usedKb = Math.max(0, tot - free);

      return Number((usedKb / 1024).toFixed(2));
    }

    function readNofile(): {
      soft: number | null;
      hard: number | null;
    } {
      if (!isLinux) return { soft: null, hard: null as number | null };

      const txt = readFile('/proc/self/limits');
      if (!txt) return { soft: 0, hard: 0 };

      const line = txt.split('\n').find((l) => l.startsWith('Max open files'));
      if (!line) return { soft: 0, hard: 0 };

      const parts = line.trim().split(/\s+/);
      const soft = Number(parts[3]) || 0;
      const hard = Number(parts[4]) || 0;

      return { soft, hard };
    }

    async function countOpenFds(): Promise<number | null> {
      if (!isLinux) return null;

      try {
        return (await fs.readdir('/proc/self/fd')).length;
      } catch {
        return 0;
      }
    }

    const toMb = (bytes: number | null | undefined) =>
      bytes == null ? null : Number(bytes / megabyte).toFixed(2);

    const cgMem: {
      readonly limitBytes: number | null;
      readonly usedBytes: number | null;
    } = readCgroupMemory();

    const quotaCores: number | null = readCgroupCpu().quotaCores;

    const container: {
      readonly inContainer: boolean;
      readonly cgroupVersion: 'v2' | 'v1' | null;
      readonly runtimeHint: string | null;
    } = detectContainer();

    const path: string = getRootPath();

    const disk: {
      diskPath: string;
      freeMb: number;
      sizeMb: number;
      usedMb: number;
    } | null = await checkDiskSpace(path)
      .then((res: DiskSpace) => {
        return {
          diskPath: res.diskPath,
          freeMb: Number((res.free / megabyte).toFixed(2)),
          sizeMb: Number((res.size / megabyte).toFixed(2)),
          usedMb: Number(((res.size - res.free) / megabyte).toFixed(2)),
        };
      })
      .catch(() => null);

    const nofile: {
      soft: number | null;
      hard: number | null;
    } = readNofile();

    const openFds: number | null = await countOpenFds();

    const payload = {
      host: {
        hostname: os.hostname(),
        os: {
          platform: os.platform(),
          kernel: os.release(),
          arch: os.arch(),
        },
        container: {
          inContainer: container.inContainer,
          cgroupVersion: container.cgroupVersion,
          runtimeHint: container.runtimeHint,
        },
      },
      runtime: {
        node: process.version,
        v8: process.versions.v8,
        appVersion: process.env.APP_VERSION ?? null,
        gitSha: process.env.GIT_SHA ?? null,
      },
      cpu: {
        model: os.cpus()[0].model.trim() ?? '[unknown]',
        logicalCores: os.cpus().length,
        quotaCores: quotaCores,
        limited: quotaCores != null,
        loadAvg: isWindows ? [null, null, null] : os.loadavg(),
      },
      memory: {
        hostTotalMb: toMb(os.totalmem()),
        cgroupLimitMb: toMb(cgMem.limitBytes) ?? null,
        cgroupUsedMb: toMb(cgMem.usedBytes) ?? null,
        cgroupUsedPct:
          cgMem.limitBytes && cgMem.usedBytes != null && cgMem.limitBytes > 0
            ? Math.round((cgMem.usedBytes / cgMem.limitBytes) * 100)
            : null,
        swapTotalMb: readSwapTotalMb(),
        swapUsedMb: readSwapUsedMb(),
      },
      disk: disk,
      limits: { nofile, openFds },
      network: {
        primaryIp: getPrimaryIp(),
        ifaces: ifaceList(),
      },
      uptime: {
        processSec: Math.floor(process.uptime()),
        systemSec: readSystemUptimeSec(),
      },
      warnings: [],
    };

    return indicator.up({
      ...payload,
      warning: this.buildSystemWarnings(payload),
    });
  }

  private buildSystemWarnings(details: isystemhealth): Warning[] {
    const warnings: Warning[] = [];

    if (details.cpu.quotaCores != null)
      warnings.push({
        message: `CPU quota imposed (${details.cpu.quotaCores.toFixed(2)} cores)`,
        severity: 'info',
      });

    if (
      details.cpu.loadAvg &&
      details.cpu.loadAvg[0] != null &&
      details.cpu.loadAvg[0] > details.cpu.logicalCores
    )
      warnings.push({
        message: `High 1m load average (${details.cpu.loadAvg[0].toFixed(2)})`,
        severity: 'warning',
      });

    if (
      details.memory.cgroupUsedPct != null &&
      details.memory.cgroupUsedPct > 90
    )
      warnings.push({
        message: `Memory usage high (${details.memory.cgroupUsedPct}%)`,
        severity: 'critical',
      });

    if (details.memory.swapUsedMb && details.memory.swapUsedMb > 0)
      warnings.push({
        message: `Swap space in use (${details.memory.swapUsedMb} MB)`,
        severity: 'warning',
      });

    if (details.disk && details.disk.sizeMb > 0) {
      const freePct = (details.disk.freeMb / details.disk.sizeMb) * 100;
      if (freePct < 10) {
        warnings.push({
          message: `Low disk space (${freePct.toFixed(1)}% free)`,
          severity: 'critical',
        });
      }
    }

    if (details.limits.openFds != null && details.limits.nofile.soft != null) {
      const fdPct = (details.limits.openFds / details.limits.nofile.soft) * 100;
      if (fdPct > 80) {
        warnings.push({
          message: `File descriptor usage high (${fdPct.toFixed(1)}% of soft limit)`,
          severity: 'warning',
        });
      }
    }

    if (details.uptime.systemSec < 300)
      warnings.push({
        message: `System restarted recently (${details.uptime.systemSec}s)`,
        severity: 'info',
      });

    if (details.uptime.processSec < 60)
      warnings.push({
        message: `App process restarted recently (${details.uptime.processSec}s)`,
        severity: 'info',
      });

    if (details.host.container.inContainer)
      warnings.push({
        message: `Running inside ${details.host.container.runtimeHint ?? 'container'}`,
        severity: 'info',
      });

    return warnings;
  }
}
