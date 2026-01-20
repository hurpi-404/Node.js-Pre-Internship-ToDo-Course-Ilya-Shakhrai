import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RedisService } from "./redis.service";
import { CreateToDoDto } from "./dto/create-to-do.dto";
import { UpdateToDoDto } from "./dto/update-to-do.dto";
import { ToDoResponseDto } from "./dto/to-do-response.dto";

@Injectable()
export class ToDoService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async create(createToDoDto: CreateToDoDto): Promise<ToDoResponseDto> {
    const todo = await this.prisma.todo.create({
      data: createToDoDto,
    });

    // Invalidate cache
    await this.redis.del("todos:all");

    return ToDoResponseDto.fromPrisma(todo);
  }

  async findAll(): Promise<ToDoResponseDto[]> {
    const cacheKey = "todos:all";

    // Check cache
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      console.log("✅ Cache hit for all todos");
      return JSON.parse(cached);
    }

    // Cache miss - fetch from database
    console.log(" Cache miss for all todos");
    const todos = await this.prisma.todo.findMany();
    const response = ToDoResponseDto.fromPrismaArray(todos);

    await this.redis.set(cacheKey, JSON.stringify(response), 300);

    return response;
  }

  async findOne(id: number): Promise<ToDoResponseDto> {
    const todo = await this.prisma.todo.findUnique({
      where: { id },
    });
    return ToDoResponseDto.fromPrisma(todo);
  }

  async update(
    id: number,
    updateToDoDto: UpdateToDoDto,
  ): Promise<ToDoResponseDto> {
    const todo = await this.prisma.todo.update({
      where: { id },
      data: updateToDoDto,
    });

    // Invalidate cache
    await this.redis.del("todos:all");

    return ToDoResponseDto.fromPrisma(todo);
  }

  async remove(id: number): Promise<ToDoResponseDto> {
    const todo = await this.prisma.todo.delete({
      where: { id },
    });

    // Invalidate cache
    await this.redis.del("todos:all");

    return ToDoResponseDto.fromPrisma(todo);
  }
}
