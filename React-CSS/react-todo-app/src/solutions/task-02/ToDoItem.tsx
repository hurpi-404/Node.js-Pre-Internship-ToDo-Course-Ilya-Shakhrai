import React from "react";
import { TodoItemProps } from "../../types";
import "./ToDoItems.css";
export const ToDoItem: React.FC<TodoItemProps> = ({ todo }) => {
  return (
    <li className={todo.completed ? "completedTodo" : "activeTodo"}>
      <span>{todo.title}</span>
      <span>{todo.completed ? " (Completed)" : " (Not Completed)"}</span>
    </li>
  );
};
