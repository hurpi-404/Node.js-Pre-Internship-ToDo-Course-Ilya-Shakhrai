import { Module } from '@nestjs/common';
import { NestBasicsController } from './nest-basics.controller';
import { NestBasicsService } from './nest-basics.service';
import { LoggerModule } from './logger-module/logger-module.module';
import { MathModule } from './math-module/math-module.module';
import { UserModule } from './user-module/user-module.module';
import { AuditModule } from './audit-module/audit.module';
import { ControllerModule } from './controller-module/controller.module';
import { ToDoModule } from './to-do/to-do.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, LoggerModule, MathModule, UserModule, AuditModule, ControllerModule, ToDoModule],
  controllers: [NestBasicsController],
  providers: [NestBasicsService],
})
export class NestBasicsModule {}
