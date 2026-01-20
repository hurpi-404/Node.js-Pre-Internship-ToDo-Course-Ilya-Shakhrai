import { Module } from '@nestjs/common';
import { UserController } from '../user-module/user.controller';
import { AuditModule } from '../audit-module/audit.module';

@Module({
  imports: [AuditModule],
  controllers: [UserController],
})
export class ControllerModule {}
