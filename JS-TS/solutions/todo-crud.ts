import { Todo } from './types';

export function addTodo(state: Todo[], todo: Todo): Todo[] {
  return [...state, todo];
}

export function updateTodo(
  state: Todo[], 
  id: number, 
  update: Partial<Omit<Todo, 'id' | 'createdAt'>>
): Todo[] {
  const index = state.findIndex(todo => todo.id === id);
  
  if (index === -1) {
    throw new Error(`Todo with id ${id} not found`);
  }
  
  return state.map((todo, i) => {
    if (i === index) {
      return {
        ...todo,
        ...update
      };
    }
    return todo;
  });
}

export function removeTodo(state: Todo[], id: number): Todo[] {
  const index = state.findIndex(todo => todo.id === id);
  
  if (index === -1) {
    throw new Error(`Todo with id ${id} not found`);
  }
  return state.filter((todo, i) => i !== index);
}

export function getTodo(state: Todo[], id: number): Todo | undefined {
  return state.find(todo => todo.id === id);
}