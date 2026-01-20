import React from "react";
import { TodoItemProps } from "../../types";
import "./StyledToDoItem.css";

export const StyledToDoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const itemClass = `todo-item ${todo.completed ? "completed" : ""}`;
  return (
    <div className={itemClass}>
      <span>{todo.title}</span>
      <span> - {todo.completed ? "completed" : "not completed"}</span>
    </div>
  );
};
