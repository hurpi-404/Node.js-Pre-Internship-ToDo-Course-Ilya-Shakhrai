import React from "react";
import { ActiveCountProps } from "../../types";
export const ActiveCount: React.FC<ActiveCountProps> = ({ todos }) => {
  const activeCount = todos.filter(todo => !todo.completed).length;

  return (
    <div>
      <p>{activeCount} active {activeCount === 1 ? 'todo' : 'todos'}</p>
    </div>
  );
};
