import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class BasicGuardGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return !!request.user;
  }
} 
