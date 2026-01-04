import { InMemoryRepository } from './repository';
import { Todo, NewTodo, TodoStatus } from './types';

export class TodoNotFoundError extends Error {
  constructor(id: number) {
    super(`Todo with id ${id} not found`);
    this.name = 'TodoNotFoundError';
  }
}

export class TodoApi {
  private repo = new InMemoryRepository<Todo>();
  private nextId = 1;

  private getRandomDelay(): number {
    return Math.floor(Math.random() * 301) + 300;
  }

  private delay(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(resolve, this.getRandomDelay());
    });
  }

  async getAll(): Promise<Todo[]> {
    await this.delay();
    return this.repo.findAll(); 
  }

  async add(newTodo: NewTodo): Promise<Todo> {
    await this.delay();
    
    const todo: Todo = {
      id: this.nextId++,
      title: newTodo.title,
      description: newTodo.description,
      status: newTodo.status || TodoStatus.PENDING,
      createdAt: new Date()
    };
    
    this.repo.add(todo);
    return todo;
  }

  async update(id: number, update: Partial<Omit<Todo, 'id' | 'createdAt'>>): Promise<Todo> {
    await this.delay();
    
    const existingTodos = this.repo.findAll(); 
    const todoToUpdate = existingTodos.find((todo: Todo) => todo.id === id); // Явная типизация
    
    if (!todoToUpdate) {
      throw new TodoNotFoundError(id);
    }
    
    const updatedTodo = {
      ...todoToUpdate,
      ...update
    };
    
    this.repo.remove(id);
    this.repo.add(updatedTodo);
    
    return updatedTodo;
  }

  async remove(id: number): Promise<void> {
    await this.delay();
    
    const existingTodos = this.repo.findAll(); 
    const todoExists = existingTodos.some((todo: Todo) => todo.id === id); // Явная типизация
    
    if (!todoExists) {
      throw new TodoNotFoundError(id);
    }
    
    this.repo.remove(id);
  }
}