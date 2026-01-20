import { Injectable } from '@nestjs/common';

@Injectable()
export class NestBasicsService {
  getHello(): string {
    return 'Hello World!';
  }
}
