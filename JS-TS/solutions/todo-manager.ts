import { TodoService } from './todo-service';
import { TodoApi } from './todo-api';
import { Todo } from './types';

export class ToDoManager {
  private service = new TodoService(new TodoApi());

  async init(): Promise<void> {
    await this.service.create('Learn TypeScript', 'Master generics and interfaces');
    await this.service.create('Build ToDo app', 'Implement all required features');
    await this.service.create('Write tests', 'Achieve 90% coverage');
  }

  async add(title: string, description = ''): Promise<void> {
    await this.service.create(title, description);
  }

  async complete(id: number): Promise<void> {
    const todos = await this.service.search('');
    const todo = todos.find(t => t.id === id);
    
    if (!todo) {
      throw new Error(`Todo with id ${id} not found`);
    }
    
    if (todo.status === 'COMPLETED') {
      return;
    }
    
    let currentTodo = todo;
    while (currentTodo.status !== 'COMPLETED') {
      currentTodo = await this.service.toggleStatus(currentTodo.id);
    }
  }

  async list(): Promise<Todo[]> {
    return await this.service.search('');
  }
}