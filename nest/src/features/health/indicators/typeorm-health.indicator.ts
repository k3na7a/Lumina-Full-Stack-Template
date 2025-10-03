import { Injectable } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';
import { Warning } from 'src/features/health/dto/health.dto';
import { DataSource } from 'typeorm';
import { DbHealthResult, ITypeOrmHealth } from '../dto/typeorm.dto';

@Injectable()
export class TypeOrmHealthIndicator {
  constructor(
    private readonly dataSource: DataSource,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(key: 'typeorm' = 'typeorm'): Promise<DbHealthResult> {
    const indicator = this.healthIndicatorService.check(key);
    const { options, driver } = this.dataSource;

    if (!this.dataSource.isInitialized)
      return indicator.down({
        type: options.type,
        host: 'host' in options ? options.host : undefined,
        port: 'port' in options ? options.port : undefined,
        database: options.database,
        reason: 'Database connection is not initialized',
      });

    let connections: Record<string, any> = {};
    const pool: any = 'pool' in driver ? driver['pool'] : undefined;

    const start = Date.now();
    await this.dataSource.query('SELECT 1');
    const ping = Date.now() - start;

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

    const metrics = await this.collectDbMetrics();
    const warnings = this.buildDbWarnings(pool, metrics);

    const details = {
      type: options.type,
      host: 'host' in options ? options.host : undefined,
      port: 'port' in options ? options.port : undefined,
      database: options.database,
      ping,
      connections,
      metrics,
      warnings,
    } as ITypeOrmHealth;

    return indicator.up({ ...details });
  }

  private async collectDbMetrics(): Promise<{
    uptimeSec?: number;
    sessions?: number;
    commits?: number;
    rollbacks?: number;
    slowQueries?: number;
  }> {
    const type = this.dataSource.options.type;

    switch (type) {
      case 'postgres': {
        const uptimeRows = (await this.dataSource.query(
          `SELECT EXTRACT(EPOCH FROM (now() - pg_postmaster_start_time()))::int AS uptime;`,
        )) as { uptime: string }[];

        const sessionsRows = (await this.dataSource.query(
          `SELECT count(*)::int AS sessions FROM pg_stat_activity;`,
        )) as { sessions: string }[];

        const xactsRows = (await this.dataSource.query(
          `SELECT xact_commit AS commits, xact_rollback AS rollbacks
     FROM pg_stat_database WHERE datname = current_database();`,
        )) as { commits: string; rollbacks: string }[];

        return {
          uptimeSec: Number(uptimeRows?.[0]?.uptime ?? 0),
          sessions: Number(sessionsRows?.[0]?.sessions ?? 0),
          commits: Number(xactsRows?.[0]?.commits ?? 0),
          rollbacks: Number(xactsRows?.[0]?.rollbacks ?? 0),
        };
      }
      case 'mysql': {
        const uptimeRow = (await this.dataSource.query(
          `SHOW GLOBAL STATUS LIKE 'Uptime';`,
        )) as { Variable_name: string; Value: string }[];

        const threadsRow = (await this.dataSource.query(
          `SHOW GLOBAL STATUS LIKE 'Threads_connected';`,
        )) as { Variable_name: string; Value: string }[];

        const commitsRow = (await this.dataSource.query(
          `SHOW GLOBAL STATUS LIKE 'Com_commit';`,
        )) as { Variable_name: string; Value: string }[];

        const rollbacksRow = (await this.dataSource.query(
          `SHOW GLOBAL STATUS LIKE 'Com_rollback';`,
        )) as { Variable_name: string; Value: string }[];

        const slowRow = (await this.dataSource.query(
          `SHOW GLOBAL STATUS LIKE 'Slow_queries';`,
        )) as { Variable_name: string; Value: string }[];

        return {
          uptimeSec: Number(uptimeRow?.[0]?.Value ?? 0),
          sessions: Number(threadsRow?.[0]?.Value ?? 0),
          commits: Number(commitsRow?.[0]?.Value ?? 0),
          rollbacks: Number(rollbacksRow?.[0]?.Value ?? 0),
          slowQueries: Number(slowRow?.[0]?.Value ?? 0),
        };
      }
      default:
        return {};
    }
  }

  private buildDbWarnings(pool: any, metrics: any): Warning[] {
    const warnings: Warning[] = [];

    if (pool) {
      const used = pool._allConnections.length - pool._freeConnections.length;
      const limit = pool.config.connectionLimit;

      if (limit > 0 && used / limit > 0.9)
        warnings.push({
          message: `High connection pool usage (${used}/${limit})`,
          severity: 'warning',
        });

      if (pool._connectionQueue.length > 0)
        warnings.push({
          message: `Connection requests waiting in queue (${pool._connectionQueue.length})`,
          severity: 'warning',
        });
    }

    if (metrics.uptimeSec !== undefined && metrics.uptimeSec < 300)
      warnings.push({
        message: `Database restarted recently (${metrics.uptimeSec}s uptime)`,
        severity: 'info',
      });

    if (metrics.rollbacks !== undefined && metrics.rollbacks > 0) {
      const ratio =
        metrics.commits && metrics.commits > 0
          ? (metrics.rollbacks / (metrics.commits + metrics.rollbacks)) * 100
          : 0;
      if (ratio > 10)
        warnings.push({
          message: `High rollback ratio (${ratio.toFixed(1)}%)`,
          severity: 'warning',
        });
    }

    if (metrics.slowQueries !== undefined && metrics.slowQueries > 0)
      warnings.push({
        message: `Slow queries detected (${metrics.slowQueries})`,
        severity: 'warning',
      });

    return warnings;
  }
}
