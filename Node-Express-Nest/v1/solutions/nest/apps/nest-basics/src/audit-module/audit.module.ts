import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { UserModule } from '../user-module/user-module.module';

@Module({
  imports: [UserModule],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
