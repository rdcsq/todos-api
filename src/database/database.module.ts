import { FactoryProvider, Global, Logger, Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { ApiConfigModule } from 'src/api-config/api-config.module';
import { ApiConfigService } from 'src/api-config/api-config.service';
import * as schema from './database.schema';

const logger = new Logger('DatabaseFactory');

const databaseFactory: FactoryProvider = {
  provide: 'DATABASE_SERVICE',
  inject: [ApiConfigService],
  useFactory(apiConfigService: ApiConfigService) {
    logger.log(`Connecting to ${apiConfigService.databaseUrl}`);
    return drizzle(postgres(apiConfigService.databaseUrl), {
      schema,
    });
  },
};

@Global()
@Module({
  providers: [databaseFactory],
  exports: [databaseFactory],
  imports: [ApiConfigModule],
})
export class DatabaseModule {}
