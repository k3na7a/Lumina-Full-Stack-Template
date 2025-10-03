import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { seeders } from '../seeders';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeederService.name);

  constructor(private readonly dataSource: DataSource) {}

  async onApplicationBootstrap() {
    if (process.env.DB_SEED !== 'true') return;

    this.logger.log('Running seeders...');
    for (const seeder of seeders.sort((a, b) => a.order - b.order)) {
      try {
        await seeder.run(this.dataSource);
        this.logger.log(`Seeder complete: ${seeder.constructor.name}`);
      } catch (err) {
        this.logger.error(
          `Seeder failed: ${seeder.constructor.name}`,
          err.stack || err,
        );
      }
    }
  }
}
