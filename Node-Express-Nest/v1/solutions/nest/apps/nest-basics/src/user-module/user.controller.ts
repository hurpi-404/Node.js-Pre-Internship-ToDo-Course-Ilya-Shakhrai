import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AuditService } from '../audit-module/audit.service';

@Controller('users')
export class UserController {
  constructor(private readonly auditService: AuditService) {}

  @Post()
  createUser(@Body('name') name: string) {
    const audit = this.auditService.auditUserCreation(name);
    return { message: 'User created', audit };
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    const audit = this.auditService.auditUserAccess(Number(id));
    return { message: 'User accessed', audit };
  }

  @Get('audit/log')
  getAuditLog() {
    return { logs: this.auditService.getAuditLog() };
  }
}
