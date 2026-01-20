import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ToDoService } from './to-do.service';
import { CreateToDoDto } from './dto/create-to-do.dto';
import { UpdateToDoDto } from './dto/update-to-do.dto';
import { AuthGuard } from './guards/auth.guard';
import { ToDoValidationPipe } from './pipes/todo-validation.pipe';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

@Controller('to-do')
@UseGuards(AuthGuard)
@UseInterceptors(LoggingInterceptor)
export class ToDoController {
  constructor(private readonly toDoService: ToDoService) {}

  @Post()
  @UsePipes(ToDoValidationPipe, ValidationPipe)
  create(@Body() createToDoDto: CreateToDoDto) {
    console.log('4. [HANDLER] Controller method executing');
    return this.toDoService.create(createToDoDto);
  }

  @Get()
  findAll() {
    console.log('4. [HANDLER] Controller method executing');
    return this.toDoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    console.log('4. [HANDLER] Controller method executing');
    return this.toDoService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(ToDoValidationPipe, ValidationPipe)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateToDoDto: UpdateToDoDto,
  ) {
    console.log('4. [HANDLER] Controller method executing');
    return this.toDoService.update(id, updateToDoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    console.log('4. [HANDLER] Controller method executing');
    return this.toDoService.remove(id);
  }
}
