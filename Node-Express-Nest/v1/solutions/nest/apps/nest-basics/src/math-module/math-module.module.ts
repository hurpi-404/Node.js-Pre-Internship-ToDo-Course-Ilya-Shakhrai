import { Module } from '@nestjs/common';
import { MathController } from './math.controller';
import { MathService } from './math.service';
import { LoggerModule } from '../logger-module/logger-module.module';

@Module({
  imports: [LoggerModule],
  controllers: [MathController],
  providers: [MathService],
})
export class MathModule {}
