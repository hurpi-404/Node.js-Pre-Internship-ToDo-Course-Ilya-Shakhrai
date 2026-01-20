# Task 1: Modular NestJS Setup

## Architecture Overview

This implementation demonstrates NestJS modularity, dependency injection, and feature encapsulation.

## Module Structure

### 1. **LoggerModule** (`logger-module/`)
- **Purpose**: Provides logging functionality across the application
- **Exports**: `LoggerService` (available to other modules)
- **Demonstrates**: Service reusability and cross-module dependency injection

```typescript
@Module({
  providers: [LoggerService],
  exports: [LoggerService], // Makes LoggerService available to importing modules
})
export class LoggerModule {}
```

### 2. **MathModule** (`math-module/`)
- **Purpose**: Handles mathematical operations
- **Imports**: `LoggerModule` (to use LoggerService)
- **Components**:
  - `MathController`: HTTP endpoints for math operations
  - `MathService`: Business logic with injected LoggerService
- **Demonstrates**: Module composition and dependency graph

```typescript
@Module({
  imports: [LoggerModule], // Import to access LoggerService
  controllers: [MathController],
  providers: [MathService],
})
export class MathModule {}
```

## Dependency Injection Examples

### Service Injection into Service
```typescript
@Injectable()
export class MathService {
  constructor(private readonly logger: LoggerService) {}
  
  add(a: number, b: number): number {
    const result = a + b;
    this.logger.log(`Addition: ${a} + ${b} = ${result}`);
    return result;
  }
}
```

### Service Injection into Controller
```typescript
@Controller('math')
export class MathController {
  constructor(
    private readonly mathService: MathService,
    private readonly logger: LoggerService,
  ) {}
  
  @Get('add')
  add(@Query('a') a: string, @Query('b') b: string) {
    this.logger.log('Add endpoint called');
    return { result: this.mathService.add(Number(a), Number(b)) };
  }
}
```

## Key Concepts Demonstrated

### 1. **Modularity via @Module**
- Each feature is encapsulated in its own module
- Modules define their dependencies via `imports`
- Modules expose services via `exports`

### 2. **Dependency Graph via @Injectable**
- Services marked with `@Injectable()` can be injected
- NestJS automatically resolves dependencies
- Constructor injection pattern

### 3. **Feature Encapsulation**
- LoggerModule: Self-contained logging feature
- MathModule: Self-contained math operations
- Clear separation of concerns

### 4. **Reusability**
- LoggerService is used by both MathController and MathService
- Single instance shared across the application (singleton by default)

## Testing the Implementation

Start the application and test the endpoints:

```bash
# Addition
GET http://localhost:3000/math/add?a=5&b=3
# Response: { "result": 8 }

# Multiplication
GET http://localhost:3000/math/multiply?a=4&b=7
# Response: { "result": 28 }
```

Console output will show:
```
[LOG]: Add endpoint called
[LOG]: Addition: 5 + 3 = 8
```

## Dependency Graph

```
NestBasicsModule
├── LoggerModule
│   └── LoggerService
└── MathModule
    ├── imports: LoggerModule
    ├── MathController
    │   ├── injects: MathService
    │   └── injects: LoggerService
    └── MathService
        └── injects: LoggerService
```
