# Task 2: Dependency Injection Chain

## Overview
Demonstrates a three-level dependency injection chain using constructor-based DI with proper module separation:
**UserController → AuditService → UserService → LoggerService**

## Module Architecture

### 1. LoggerModule
```typescript
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
```

### 2. UserModule
```typescript
@Module({
  imports: [LoggerModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
```

### 3. AuditModule
```typescript
@Module({
  imports: [UserModule],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
```

### 4. ControllerModule
```typescript
@Module({
  imports: [AuditModule],
  controllers: [UserController],
})
export class ControllerModule {}
```

## Dependency Chain

### Level 1: LoggerService (Base Dependency)
```typescript
@Injectable()
export class LoggerService {
  log(message: string) {
    console.log(`[LOG]: ${message}`);
  }
}
```

### Level 2: UserService (Depends on LoggerService)
```typescript
@Injectable()
export class UserService {
  constructor(private readonly logger: LoggerService) {}
  
  createUser(name: string) {
    this.logger.log(`Creating user: ${name}`);
    return { id: Date.now(), name };
  }
}
```

### Level 3: AuditService (Depends on UserService)
```typescript
@Injectable()
export class AuditService {
  constructor(private readonly userService: UserService) {}
  
  auditUserCreation(name: string): string {
    const user = this.userService.createUser(name);
    const auditEntry = `[AUDIT] User created: ${user.name}`;
    return auditEntry;
  }
}
```

### Level 4: UserController (Depends on AuditService)
```typescript
@Controller('users')
export class UserController {
  constructor(private readonly auditService: AuditService) {}
  
  @Post()
  createUser(@Body('name') name: string) {
    return this.auditService.auditUserCreation(name);
  }
}
```

## Key Concepts

### 1. Constructor-Based Dependency Injection
- Dependencies declared in constructor parameters
- NestJS automatically resolves and injects dependencies
- Type-safe and explicit

### 2. Module Separation
- Each service has its own module
- Modules export services for other modules to use
- Clear module boundaries and dependencies

### 3. Dependency Resolution
NestJS resolves the chain automatically:
1. UserController needs AuditService
2. AuditService needs UserService (from UserModule)
3. UserService needs LoggerService (from LoggerModule)
4. All dependencies resolved through module imports

### 4. Singleton Pattern
- All services are singletons by default
- Same instance shared across the application
- Efficient memory usage

## Testing the Chain

```bash
# Create a user (triggers full chain)
POST http://localhost:3000/users
Body: { "name": "Alice" }

# Get a user
GET http://localhost:3000/users/123

# View audit log
GET http://localhost:3000/users/audit/log
```

## Console Output
```
[LOG]: Creating user: Alice
[LOG]: Fetching user with id: 123
```

## Dependency Graph
```
NestBasicsModule
├── LoggerModule
│   └── LoggerService
├── UserModule
│   ├── imports: LoggerModule
│   └── UserService
│       └── injects: LoggerService
├── AuditModule
│   ├── imports: UserModule
│   └── AuditService
│       └── injects: UserService
└── ControllerModule
    ├── imports: AuditModule
    └── UserController
        └── injects: AuditService
```

## Benefits of This Pattern
- **Modularity**: Each service in its own module
- **Loose Coupling**: Services only know about direct dependencies
- **Testability**: Easy to mock dependencies in unit tests
- **Maintainability**: Clear dependency hierarchy
- **Reusability**: Services can be imported by any module
- **Encapsulation**: Module boundaries enforce proper architecture
