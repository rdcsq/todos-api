import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AccountsModule } from './accounts/accounts.module';
import { ApiConfigModule } from './api-config/api-config.module';
import { AuthModule } from './auth/auth.module';
import { ListsModule } from './lists/lists.module';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    DatabaseModule,
    AccountsModule,
    ApiConfigModule,
    AuthModule,
    ListsModule,
    TodosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
