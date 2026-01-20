# Task 3 & 4: Request Lifecycle + ToDo CRUD with DTOs

## Task 3: Request Lifecycle Exploration

### Overview
Demonstrates the complete NestJS request lifecycle with Guard, Pipe, and Interceptor applied to ToDo routes.

### Request Lifecycle Order

```
1. Guard (AuthGuard) - Authorization check
2. Pipe (ToDoValidationPipe) - Data transformation
3. Interceptor (Before) - Pre-processing
4. Handler - Controller method execution
5. Interceptor (After) - Post-processing & response transformation
```

### Components

#### 1. AuthGuard (`guards/auth.guard.ts`)
**Purpose**: Block unauthorized requests

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    
    if (!authHeader) {
      return false; // Block access
    }
    
    return true; // Allow access
  }
}
```

**Blocks access when**: No `Authorization` header present

#### 2. ToDoValidationPipe (`pipes/todo-validation.pipe.ts`)
**Purpose**: Transform and validate incoming data

```typescript
@Injectable()
export class ToDoValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // Trim all string properties
    if (value && typeof value === 'object') {
      Object.keys(value).forEach(key => {
        if (typeof value[key] === 'string') {
          value[key] = value[key].trim();
        }
      });
    }
    return value;
  }
}
```

**Transforms**: Trims whitespace from string fields

#### 3. LoggingInterceptor (`interceptors/logging.interceptor.ts`)
**Purpose**: Log requests and transform responses

```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before handler');
    const now = Date.now();
    
    return next.handle().pipe(
      tap(() => console.log(`After handler - ${Date.now() - now}ms`)),
      map(data => ({
        success: true,
        timestamp: new Date().toISOString(),
        data,
      })),
    );
  }
}
```

**Adds to response**: `success`, `timestamp`, wraps data

### Applied to Controller

```typescript
@Controller('to-do')
@UseGuards(AuthGuard)              // Applied to all routes
@UseInterceptors(LoggingInterceptor) // Applied to all routes
export class ToDoController {
  
  @Post()
  @UsePipes(ToDoValidationPipe, ValidationPipe) // Applied to this route
  create(@Body() createToDoDto: CreateToDoDto) {
    return this.toDoService.create(createToDoDto);
  }
}
```

### Console Output Example

```
1. [GUARD] AuthGuard - Checking authorization
   [GUARD] Access GRANTED
2. [PIPE] ToDoValidationPipe - Transforming and validating data
   [PIPE] Type: body, Data: { title: '  Task  ', ... }
   [PIPE] Data transformed
3. [INTERCEPTOR] Before handler execution
   [INTERCEPTOR] POST /to-do
4. [HANDLER] Controller method executing
5. [INTERCEPTOR] After handler execution - 5ms
   [INTERCEPTOR] Transforming response
```

### Testing

**With Authorization (Success):**
```bash
curl -X POST http://localhost:3000/to-do \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{"title":"Task","description":"Desc","isCompleted":false}'
```

**Without Authorization (Blocked):**
```bash
curl -X POST http://localhost:3000/to-do \
  -H "Content-Type: application/json" \
  -d '{"title":"Task","description":"Desc","isCompleted":false}'
# Returns 403 Forbidden
```

---

## Task 4: ToDo CRUD with DTOs

### Overview
Complete CRUD implementation with DTOs, validation, and proper NestJS architecture.

### Module Structure

```
to-do/
├── dto/
│   ├── create-to-do.dto.ts    # CreateToDoDto with validation
│   └── update-to-do.dto.ts    # UpdateToDoDto (PartialType)
├── entities/
│   └── to-do.entity.ts        # ToDo entity
├── guards/
│   └── auth.guard.ts          # Authorization guard
├── pipes/
│   └── todo-validation.pipe.ts # Custom validation pipe
├── interceptors/
│   └── logging.interceptor.ts # Logging interceptor
├── to-do.controller.ts        # REST endpoints
├── to-do.service.ts           # Business logic
└── to-do.module.ts            # Module definition
```

### DTOs with Validation

#### CreateToDoDto
```typescript
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateToDoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  isCompleted: boolean;
}
```

#### UpdateToDoDto
```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateToDoDto } from './create-to-do.dto';

export class UpdateToDoDto extends PartialType(CreateToDoDto) {}
```

**PartialType**: Makes all fields optional for updates

### Controller with Validation

```typescript
@Controller('to-do')
@UseGuards(AuthGuard)
@UseInterceptors(LoggingInterceptor)
export class ToDoController {
  constructor(private readonly toDoService: ToDoService) {}

  @Post()
  @UsePipes(ToDoValidationPipe, ValidationPipe)
  create(@Body() createToDoDto: CreateToDoDto) {
    return this.toDoService.create(createToDoDto);
  }

  @Get()
  findAll() {
    return this.toDoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.toDoService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(ToDoValidationPipe, ValidationPipe)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateToDoDto: UpdateToDoDto,
  ) {
    return this.toDoService.update(id, updateToDoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.toDoService.remove(id);
  }
}
```

### Validation Features

1. **class-validator decorators**: `@IsString()`, `@IsNotEmpty()`, `@IsBoolean()`
2. **ValidationPipe**: Automatically validates DTOs
3. **ParseIntPipe**: Validates and transforms route params to numbers
4. **Custom ToDoValidationPipe**: Trims whitespace from strings

### API Endpoints

| Method | Endpoint | Description | DTO |
|--------|----------|-------------|-----|
| POST | `/to-do` | Create todo | CreateToDoDto |
| GET | `/to-do` | Get all todos | - |
| GET | `/to-do/:id` | Get todo by id | - |
| PATCH | `/to-do/:id` | Update todo | UpdateToDoDto |
| DELETE | `/to-do/:id` | Delete todo | - |

### Validation Examples

**Valid Request:**
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "isCompleted": false
}
```

**Invalid Request (missing title):**
```json
{
  "description": "Milk, eggs, bread",
  "isCompleted": false
}
// Returns 400 Bad Request with validation errors
```

**Invalid Request (wrong type):**
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "isCompleted": "false"  // Should be boolean
}
// Returns 400 Bad Request
```

### Module Configuration

```typescript
@Module({
  controllers: [ToDoController],
  providers: [ToDoService],
})
export class ToDoModule {}
```

### Key Features

1. **Type Safety**: TypeScript + DTOs ensure type correctness
2. **Validation**: Automatic validation with class-validator
3. **Transformation**: ParseIntPipe, custom pipes
4. **Security**: AuthGuard blocks unauthorized access
5. **Logging**: LoggingInterceptor tracks all requests
6. **Response Format**: Consistent response structure

### Dependencies Required

```bash
npm install class-validator class-transformer
npm install @nestjs/mapped-types
npm install rxjs
```

### Testing All Features

```bash
# Create todo (with auth, validation, logging)
curl -X POST http://localhost:3000/to-do \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{"title":"Task","description":"Desc","isCompleted":false}'

# Response:
{
  "success": true,
  "timestamp": "2024-01-28T...",
  "data": "This action adds a new toDo"
}
```

## Summary

**Task 3**: Demonstrates complete request lifecycle with Guard → Pipe → Interceptor → Handler → Interceptor

**Task 4**: Full CRUD with DTOs, validation, and proper NestJS architecture

Both tasks integrated into a single ToDo module showcasing NestJS best practices.
