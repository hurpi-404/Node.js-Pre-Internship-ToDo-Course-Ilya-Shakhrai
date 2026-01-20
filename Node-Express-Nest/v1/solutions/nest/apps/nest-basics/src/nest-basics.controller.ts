import { Controller, Get } from '@nestjs/common';
import { NestBasicsService } from './nest-basics.service';

@Controller()
export class NestBasicsController {
  constructor(private readonly nestBasicsService: NestBasicsService) {}

  @Get()
  getHello(): string {
    return this.nestBasicsService.getHello();
  }
}
