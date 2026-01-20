import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger-module/logger-service/logger-service.service';

@Injectable()
export class MathService {
  constructor(private readonly logger: LoggerService) {}

  add(a: number, b: number): number {
    const result = a + b;
    this.logger.log(`Addition: ${a} + ${b} = ${result}`);
    return result;
  }

  multiply(a: number, b: number): number {
    const result = a * b;
    this.logger.log(`Multiplication: ${a} * ${b} = ${result}`);
    return result;
  }
}
