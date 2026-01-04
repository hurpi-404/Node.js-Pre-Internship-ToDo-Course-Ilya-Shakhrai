import { TodoApi } from './todo-api';
import { Todo, TodoStatus } from './types';

export class TodoService {
  constructor(private readonly api: TodoApi) { }

  async create(title: string, description = ''): Promise<Todo> {
    if (!title || title.trim().length === 0) {
      throw new Error('Title cannot be empty');
    }

    if (title.length > 100) {
      throw new Error('Title cannot exceed 100 characters');
    }

    if (description && description.length > 500) {
      throw new Error('Description cannot exceed 500 characters');
    }

    return this.api.add({
      title: title.trim(),
      description: description.trim(),
      status: TodoStatus.PENDING
    });
  }

  async toggleStatus(id: number): Promise<Todo> {
    const todos = await this.api.getAll();
    const todo = todos.find(t => t.id === id);
    
    if (!todo) {
      throw new Error(`Todo with id ${id} not found`);
    }

    let nextStatus: TodoStatus;
    switch (todo.status) {
      case TodoStatus.PENDING:
        nextStatus = TodoStatus.IN_PROGRESS;
        break;
      case TodoStatus.IN_PROGRESS:
        nextStatus = TodoStatus.COMPLETED;
        break;
      case TodoStatus.COMPLETED:
        nextStatus = TodoStatus.PENDING;
        break;
      default:
        nextStatus = TodoStatus.PENDING;
    }

    return this.api.update(id, { status: nextStatus });
  }

async search(keyword: string): Promise<Todo[]> {
  if (!keyword || keyword.trim().length === 0) {
    throw new Error('Search keyword cannot be empty');
  }

  const todos = await this.api.getAll();
  const searchTerm = keyword.toLowerCase().trim();

  return todos.filter(todo => {
    const titleMatch = todo.title.toLowerCase().includes(searchTerm);
    const descriptionMatch = todo.description 
      ? todo.description.toLowerCase().includes(searchTerm)
      : false;
    
    return titleMatch || descriptionMatch;
  });
}
}