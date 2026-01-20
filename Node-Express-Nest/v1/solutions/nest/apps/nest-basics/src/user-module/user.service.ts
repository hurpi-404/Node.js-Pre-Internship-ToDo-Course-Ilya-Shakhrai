import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger-module/logger-service/logger-service.service';

@Injectable()
export class UserService {
  constructor(private readonly logger: LoggerService) {}

  createUser(name: string): { id: number; name: string } {
    this.logger.log(`Creating user: ${name}`);
    return { id: Date.now(), name };
  }

  getUser(id: number): { id: number; name: string } {
    this.logger.log(`Fetching user with id: ${id}`);
    return { id, name: 'John Doe' };
  }
}
