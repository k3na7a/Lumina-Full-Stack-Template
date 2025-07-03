import { Injectable } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';
import { DataSource } from 'typeorm';

@Injectable()
export class TypeOrmHealthIndicator {
  constructor(
    private readonly dataSource: DataSource,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(key = 'database'): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicatorService.check(key);
    const { options, driver } = this.dataSource;

    let connections: Record<string, any> = {};
    const pool: any = 'pool' in driver ? driver['pool'] : undefined;

    if (pool) {
      const used = pool._allConnections.length - pool._freeConnections.length;
      const free = pool._freeConnections.length;
      const queue = pool._connectionQueue.length;
      const limit = pool.config.connectionLimit;

      const percentUsed = limit > 0 ? (used / limit) * 100 : 0;

      connections = {
        used,
        free,
        queue,
        limit,
        percentUsed: Number(percentUsed.toFixed(2)),
      };
    }

    const details = {
      type: options.type,
      host: 'host' in options ? options.host : undefined,
      port: 'port' in options ? options.port : undefined,
      database: options.database,
      connections,
    };

    if (!this.dataSource.isInitialized) {
      return indicator.down({
        ...details,
        reason: 'Database connection is not initialized',
      });
    }

    const start = Date.now();
    return this.dataSource
      .query('SELECT 1')
      .then(() => {
        const ping = Date.now() - start;
        return indicator.up({ ...details, ping });
      })
      .catch((error) =>
        indicator.down({ ...details, reason: error?.message ?? String(error) }),
      );
  }
}
