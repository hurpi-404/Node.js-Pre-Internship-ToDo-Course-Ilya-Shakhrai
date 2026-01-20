import React, { useState } from "react";
import { Todo } from "../../types";

export const AddToDoForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTodo: Todo = {
      id: Date.now(),
      title: title.trim(),
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setTitle("");
  };

  const markCompleted = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add todo"
        />
        <button type="submit">Submit</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li className="toDoItem" key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => markCompleted(todo.id)}
            />
            {todo.title}
          </li>
        ))}
      </ul>
    </div>
  );
};
