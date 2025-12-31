import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class HealthService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Performs all health checks and returns their status.
   * @returns An object containing the status of different components.
   */
  async getHealthStatus() {
    const databaseHealthy = await this.databaseService.isHealthy();

    return {
      server: 'UP',
      database: databaseHealthy ? 'UP' : 'DOWN',
      timestamp: new Date().toISOString(),
    };
  }
}
