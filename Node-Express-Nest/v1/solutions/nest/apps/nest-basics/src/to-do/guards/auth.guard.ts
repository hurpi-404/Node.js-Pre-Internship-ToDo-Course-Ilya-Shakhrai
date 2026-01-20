import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    console.log('1. [GUARD] AuthGuard - Checking authorization');
    
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    
    // Block access if no authorization header
    if (!authHeader) {
      console.log('   [GUARD] Access DENIED - No authorization header');
      return false;
    }
    
    console.log('   [GUARD] Access GRANTED');
    return true;
  }
}
