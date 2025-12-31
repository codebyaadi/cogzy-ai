import { Global, Logger, Module, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { closeAllDatabaseConnections, createDatabase } from '@cogzy/db/drizzle';
import { DB_PROVIDER } from './database.provider';
import { DatabaseService } from './database.service';
import { EnvType } from '../config/env.schema';

const logger = new Logger('DatabaseModule');

@Global()
@Module({
  providers: [
    {
      provide: DB_PROVIDER,
      useFactory: (configService: ConfigService<EnvType>) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        if (!databaseUrl) {
          logger.error('DATABASE_URL is not defined in NestJS configuration.');
          throw new Error(
            'DATABASE_URL is not defined in NestJS configuration.',
          );
        }
        return createDatabase(databaseUrl);
      },
      inject: [ConfigService],
    },
    DatabaseService,
  ],
  exports: [DB_PROVIDER, DatabaseService],
})
export class DatabaseModule implements OnModuleDestroy {
  constructor() {}

  async onModuleDestroy() {
    await closeAllDatabaseConnections();
  }
}
