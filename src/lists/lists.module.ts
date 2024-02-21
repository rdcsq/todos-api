import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsController } from './lists.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [ListsService],
  controllers: [ListsController],
  imports: [AuthModule],
})
export class ListsModule {}
