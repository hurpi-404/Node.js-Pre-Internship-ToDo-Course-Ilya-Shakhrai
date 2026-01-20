import { Module } from "@nestjs/common";
import { LoggerService } from "./logger-service/logger-service.service";

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
