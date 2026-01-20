import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { LoggerModule } from '../logger-module/logger-module.module';

@Module({
  imports: [LoggerModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
