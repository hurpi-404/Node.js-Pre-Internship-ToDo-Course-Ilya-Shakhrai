import { Injectable } from '@nestjs/common';
import { UserService } from '../user-module/user.service';

@Injectable()
export class AuditService {
  private auditLog: string[] = [];

  constructor(private readonly userService: UserService) {}

  auditUserCreation(name: string): string {
    const user = this.userService.createUser(name);
    const auditEntry = `[AUDIT] User created: ${user.name} (ID: ${user.id})`;
    this.auditLog.push(auditEntry);
    return auditEntry;
  }

  auditUserAccess(id: number): string {
    const user = this.userService.getUser(id);
    const auditEntry = `[AUDIT] User accessed: ${user.name} (ID: ${user.id})`;
    this.auditLog.push(auditEntry);
    return auditEntry;
  }

  getAuditLog(): string[] {
    return this.auditLog;
  }
}
