# Task 5: ORM Integration with DTO Mapping

## Overview

This task demonstrates how to integrate Prisma ORM with NestJS to persist ToDo items in a PostgreSQL database, implementing the repository pattern and DTO-to-entity mapping.

## Architecture

```
 Controller ───>  Service    ───>       Prisma  ───> Database

      │              │                    │
      │              │                    │
   DTOs In      Transform DTOs       Repository
   DTOs Out     to/from Entities       Pattern
```

## Key Components

### 1. **Prisma Schema** (`prisma/schema.prisma`)

Defines the database model:

```prisma
model Todo {
  id          Int     @id @default(autoincrement())
  title       String
  description String
  isCompleted Boolean @default(false)
}
```

### 2. **PrismaService** (`src/prisma/prisma.service.ts`)

Manages database connections using the repository pattern:

```typescript
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

**Key Points:**

- Extends `PrismaClient` for database access
- Implements `OnModuleInit` to connect on startup
- Acts as the repository layer

### 3. **PrismaModule** (`src/prisma/prisma.module.ts`)

Global module that exports PrismaService:

```typescript
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

**Key Points:**

- `@Global()` makes it available everywhere
- No need to import in every module

### 4. **DTOs (Data Transfer Objects)**

#### Input DTOs:

- **CreateToDoDto**: Validates incoming data for creating todos
- **UpdateToDoDto**: Validates incoming data for updating todos

#### Output DTO:

- **ToDoResponseDto**: Transforms database entities to API responses

```typescript
export class ToDoResponseDto {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;

  static fromPrisma(todo: Todo): ToDoResponseDto {
    return {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      isCompleted: todo.isCompleted,
    };
  }
}
```

### 5. **ToDoService** (`src/to-do/to-do.service.ts`)

Implements business logic with DTO mapping:

```typescript
@Injectable()
export class ToDoService {
  constructor(private prisma: PrismaService) {}

  async create(createToDoDto: CreateToDoDto): Promise<ToDoResponseDto> {
    const todo = await this.prisma.todo.create({
      data: createToDoDto,
    });
    return ToDoResponseDto.fromPrisma(todo);
  }
}
```

## DTO Mapping Flow

### Request Flow (DTO → Entity):

```
1. Client sends JSON
2. ValidationPipe validates against CreateToDoDto
3. Service receives validated DTO
4. Prisma creates entity from DTO data
5. Database stores entity
```

### Response Flow (Entity → DTO):

```
1. Prisma returns Todo entity from database
2. Service transforms entity using ToDoResponseDto.fromPrisma()
3. Controller returns transformed DTO
4. Client receives JSON response
```

## Repository Pattern Implementation

The repository pattern is implemented through:

1. **PrismaService as Repository**: Acts as the data access layer
2. **Service Layer**: Uses PrismaService methods (create, findMany, update, delete)
3. **Separation of Concerns**: Business logic in service, data access in Prisma

Example:

```typescript
// Repository pattern in action
async findAll(): Promise<ToDoResponseDto[]> {
  // 1. Repository call
  const todos = await this.prisma.todo.findMany();

  // 2. Transform entities to DTOs
  return ToDoResponseDto.fromPrismaArray(todos);
}
```

## Benefits

### 1. **Type Safety**

- Prisma generates types from schema
- TypeScript ensures compile-time safety
- No runtime type errors

### 2. **DTO Mapping**

- Input validation with class-validator
- Output transformation for API consistency
- Separation between internal and external models

### 3. **Repository Pattern**

- Abstraction over database operations
- Easy to mock for testing
- Swappable data sources

### 4. **Clean Architecture**

```
Controller → Service → Repository (Prisma) → Database
   ↓           ↓            ↓
  DTOs    Business Logic  Data Access
```

## Testing the Implementation

### 1. Start the application:

```bash
npm run start:dev
```

### 2. Test endpoints:

**Create Todo:**

```bash
curl -X POST http://localhost:3000/to-do \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn NestJS","description":"Complete Task 5","isCompleted":false}'
```

**Get All Todos:**

```bash
curl http://localhost:3000/to-do
```

**Get One Todo:**

```bash
curl http://localhost:3000/to-do/1
```

**Update Todo:**

```bash
curl -X PATCH http://localhost:3000/to-do/1 \
  -H "Content-Type: application/json" \
  -d '{"isCompleted":true}'
```

**Delete Todo:**

```bash
curl -X DELETE http://localhost:3000/to-do/1
```

## Key Learnings

1. **ORM Integration**: Prisma provides type-safe database access
2. **DTO Mapping**: Separates internal models from API contracts
3. **Repository Pattern**: PrismaService acts as the repository layer
4. **Transformation**: Static methods transform entities to response DTOs
5. **Dependency Injection**: PrismaService injected into ToDoService
6. **Global Modules**: @Global() decorator makes modules available everywhere

## Database Schema vs DTOs

| Aspect      | Database (Prisma Schema) | DTOs                        |
| ----------- | ------------------------ | --------------------------- |
| Purpose     | Define storage structure | Define API contract         |
| Validation  | Database constraints     | class-validator decorators  |
| Type Source | Generated by Prisma      | Manually defined            |
| Usage       | Internal (service layer) | External (controller layer) |

## Conclusion

This implementation demonstrates:

- Prisma ORM integration with PostgreSQL
- DTO-to-entity mapping (CreateToDoDto → Todo)
- Entity-to-DTO transformation (Todo → ToDoResponseDto)
- Repository pattern via PrismaService
- Clean separation of concerns
- Type-safe database operations
