export class ToDoResponseDto {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;

  static fromPrisma(todo: any): ToDoResponseDto {
    return {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      isCompleted: todo.isCompleted,
    };
  }

  static fromPrismaArray(todos: any[]): ToDoResponseDto[] {
    return todos.map((todo) => this.fromPrisma(todo));
  }
}
