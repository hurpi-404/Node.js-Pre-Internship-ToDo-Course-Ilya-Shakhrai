import { Todo, NewTodo, TodoStatus } from './types';

let nextId = 1;

export function createTodo(input: NewTodo): Todo {
  const todo: Todo = {
    id: nextId++, // Присваиваем текущий ID и увеличиваем счетчик
    title: input.title,
    description: input.description, // description уже optional, так что просто копируем
    status: input.status || TodoStatus.PENDING,
    createdAt: new Date()
  };
  
  return todo;
}