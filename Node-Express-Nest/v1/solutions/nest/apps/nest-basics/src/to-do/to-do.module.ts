import { Module } from '@nestjs/common';
import { ToDoService } from './to-do.service';
import { ToDoController } from './to-do.controller';
import { RedisService } from './redis.service';

@Module({
  controllers: [ToDoController],
  providers: [ToDoService, RedisService],
})
export class ToDoModule {}
