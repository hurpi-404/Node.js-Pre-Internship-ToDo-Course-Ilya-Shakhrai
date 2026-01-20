import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('3. [INTERCEPTOR] Before handler execution');
    
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    console.log(`   [INTERCEPTOR] ${request.method} ${request.url}`);
    
    return next.handle().pipe(
      tap(() => {
        console.log(`5. [INTERCEPTOR] After handler execution - ${Date.now() - now}ms`);
      }),
      map(data => {
        console.log('   [INTERCEPTOR] Transforming response');
        return {
          success: true,
          timestamp: new Date().toISOString(),
          data,
        };
      }),
    );
  }
}
