import React from "react";
import { TodoListProps } from "../../types";
export const ToDoList: React.FC<TodoListProps> = ({ todos }) => {
  if (!todos.length) {
    return <div>No todos available</div>;
  }

  return (
    <div>
      <h3>Todo List</h3>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span>{todo.title} - {todo.completed ? "completed" : "not completed"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
