import { megabyte } from '@lib/constants/size.constants';
import { iredisoverview, KeyspaceEntry, Warning } from '@lib/dto/health.dto';
import { Injectable } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';
import Redis from 'ioredis';
import { connection } from 'src/config/redis.config';
import { RedisHealthResult } from '../dto/redis.dto';

@Injectable()
export class RedisHealthIndicator {
  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async overviewCheck(key: 'redis' = 'redis'): Promise<RedisHealthResult> {
    const indicator = this.healthIndicatorService.check(key);
    const redis = new Redis(connection);

    return new Promise<iredisoverview>(async (resolve) => {
      const rawInfo: string = (await redis.info('all')) as string;

      const start = Date.now();
      await redis.ping();
      const ping = Date.now() - start;

      const configMaxmem: [key: string, value: string] | null = (await redis
        .config('GET', 'maxmemory')
        .catch(() => null)) as [string, string] | null;

      const configPolicy: [string, string] | null = (await redis
        .config('GET', 'maxmemory-policy')
        .catch(() => null)) as [string, string] | null;

      const slowlogLen: number = (await redis
        .call('SLOWLOG', 'LEN')
        .catch(() => 0)) as number;

      const latencyLatest: Array<[string, number, number]> = (await redis
        .call('LATENCY', 'LATEST')
        .catch(() => [])) as Array<[string, number, number]>;

      const info = this.parseInfo(rawInfo);

      const usedMem: number = Number(info.memory?.used_memory ?? 0);
      const peakMem: number = Number(info.memory?.used_memory_peak ?? 0);
      const frag: number = Number(info.memory?.mem_fragmentation_ratio ?? 0);
      const maxMem: number = configMaxmem?.[1] ? Number(configMaxmem[1]) : 0;
      const usedPct: number | null = maxMem > 0 ? usedMem / maxMem : null;

      const hits = Number(info.stats?.keyspace_hits ?? 0);
      const misses = Number(info.stats?.keyspace_misses ?? 0);

      const payload = {
        collectedAt: new Date().toISOString(),
        ping: ping,
        host: connection.host,
        port: connection.port,
        server: {
          version: info.server?.redis_version ?? null,
          mode: info.server?.redis_mode ?? null,
          os: info.server?.os ?? null,
          uptimeSec: Number(info.server?.uptime_in_seconds ?? 0),
        },
        clients: {
          connected: Number(info.clients?.connected_clients ?? 0),
          blocked: Number(info.clients?.blocked_clients ?? 0),
        },
        memory: {
          usedMb: Number((usedMem / megabyte).toFixed(2)),
          peakMb: Number((peakMem / megabyte).toFixed(2)),
          fragmentationRatio: Number(frag.toFixed(2)),
          maxMemoryMb: maxMem ? Math.round(maxMem / megabyte) : null,
          usedPctOfMax: usedPct ? Number((usedPct * 100).toFixed(2)) : null,
          maxmemoryPolicy: configPolicy?.[1] ?? null,
        },
        stats: {
          hits,
          misses,
          hitRate: hits + misses > 0 ? hits / (hits + misses) : null,
          evictedKeys: Number(info.stats?.evicted_keys ?? 0),
          expiredKeys: Number(info.stats?.expired_keys ?? 0),
        },
        keyspace: Object.entries(info.keyspace ?? {}).map(
          ([db, line]) =>
            ({
              db: Number(db.replace('db', '')),
              ...this.parseKeyspace(line as string),
            }) as KeyspaceEntry,
        ),
        persistence: {
          rdbLastSaveISO: info.persistence?.rdb_last_save_time
            ? new Date(
                Number(info.persistence.rdb_last_save_time) * 1000,
              ).toISOString()
            : null,
          rdbLastSaveTime: Number(info.persistence?.rdb_last_save_time ?? 0),
          rdbLastBgsaveStatus: info.persistence?.rdb_last_bgsave_status ?? null,
          aofEnabled: info.persistence?.aof_enabled === '1',
          aofLastRewriteStatus:
            info.persistence?.aof_last_bgrewrite_status ?? null,
        },
        replication: {
          role: info.replication?.role ?? null,
          connectedReplicas: Number(
            info.replication?.connected_slaves ??
              info.replication?.connected_replicas ??
              0,
          ),
          masterLinkStatus: info.replication?.master_link_status ?? null,
        },
        diagnostics: { slowlogLen, latencyLatest },
        warnings: [],
      };

      resolve({
        ...payload,
        warnings: this.parseWarnings(payload),
      });
    })
      .then((res: iredisoverview) => indicator.up({ ...res }))
      .catch((reason: any) =>
        indicator.down({ reason: reason?.message ?? String(reason) }),
      )
      .finally(() => redis.disconnect());
  }

  private parseInfo(raw: string): Record<string, Record<string, string>> {
    const sections: Record<string, Record<string, string>> = {};
    let current = '';

    raw.split(/\r?\n/).forEach((line) => {
      if (!line || (line.startsWith('# ') && line.length < 3)) return;

      if (line.startsWith('#')) {
        current = line.slice(2).trim().toLowerCase();
        sections[current] = {};
      } else {
        const [k, v] = line.split(':', 2);
        if (current && k && v !== undefined) {
          sections[current][k.trim()] = v.trim();
        }
      }
    });

    return sections;
  }

  private parseWarnings(res: iredisoverview) {
    const warnings: Warning[] = [];

    if (res.clients.blocked > 0)
      warnings.push({
        message: `Blocked clients: ${res.clients.blocked}`,
        severity: 'warning',
      });

    if (res.memory.fragmentationRatio > 2)
      warnings.push({
        message: `High fragmentation ratio (${res.memory.fragmentationRatio})`,
        severity: 'warning',
      });

    if (
      res.stats.hitRate !== null &&
      res.stats.hitRate < 0.5 &&
      res.stats.hits + res.stats.misses > 1000
    )
      warnings.push({
        message: `Low cache hit rate (${(res.stats.hitRate * 100).toFixed(1)}%)`,
        severity: 'info',
      });

    if (res.stats.evictedKeys > 0)
      warnings.push({
        message: `Evicted keys detected (${res.stats.evictedKeys})`,
        severity: 'critical',
      });

    if (
      res.replication.role === 'master' &&
      res.replication.connectedReplicas === 0
    )
      warnings.push({
        message: `No replicas connected`,
        severity: 'info',
      });

    if (
      res.replication.role === 'slave' &&
      res.replication.masterLinkStatus !== 'up'
    )
      warnings.push({
        message: `Replica not connected to master`,
        severity: 'critical',
      });

    if (res.persistence.rdbLastBgsaveStatus !== 'ok')
      warnings.push({
        message: `Last RDB save failed`,
        severity: 'critical',
      });

    if (
      res.persistence.aofEnabled &&
      res.persistence.aofLastRewriteStatus !== 'ok'
    )
      warnings.push({
        message: `Last AOF rewrite failed`,
        severity: 'critical',
      });

    if (res.diagnostics.slowlogLen > 0)
      warnings.push({
        message: `Slowlog has ${res.diagnostics.slowlogLen} entries`,
        severity: 'warning',
      });

    if (res.diagnostics.latencyLatest.length > 0)
      warnings.push({
        message: `Latency events detected (${res.diagnostics.latencyLatest.length})`,
        severity: 'warning',
      });

    return warnings;
  }

  private parseKeyspace(line: string): Omit<KeyspaceEntry, 'db'> {
    const out: Record<string, number> = {};
    line.split(',').forEach((kv) => {
      const [k, v] = kv.split('=');
      out[k] = Number(v);
    });

    return {
      keys: out.keys ?? 0,
      expires: out.expires ?? 0,
      avg_ttl: out.avg_ttl ?? 0,
      subexpiry: out.subexpiry,
      ...out,
    };
  }
}
