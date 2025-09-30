import { Injectable } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';
import checkDiskSpace from 'check-disk-space';
import { getRootPath } from 'src/common/utilities/path.util';

@Injectable()
export class DiskHealthIndicator {
  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async checkStorage(key = 'disk'): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicatorService.check(key);
    const path = getRootPath();
    const disk = await checkDiskSpace(path);
    const { free, size } = disk;

    const thresholdPercent = 0.9;
    const usedPercent = 1 - free / size;

    if (usedPercent < thresholdPercent) return indicator.up(disk);
    return indicator.down({
      ...disk,
      reason: `Disk space at ${Number(100 * usedPercent).toFixed(2)}%`,
    });
  }
}
