import { Controller, Get, Query } from '@nestjs/common';
import { MathService } from './math.service';
import { LoggerService } from '../logger-module/logger-service/logger-service.service';

@Controller('math')
export class MathController {
  constructor(
    private readonly mathService: MathService,
    private readonly logger: LoggerService,
  ) {}

  @Get('add')
  add(@Query('a') a: string, @Query('b') b: string) {
    this.logger.log('Add endpoint called');
    return { result: this.mathService.add(Number(a), Number(b)) };
  }

  @Get('multiply')
  multiply(@Query('a') a: string, @Query('b') b: string) {
    this.logger.log('Multiply endpoint called');
    return { result: this.mathService.multiply(Number(a), Number(b)) };
  }
}
