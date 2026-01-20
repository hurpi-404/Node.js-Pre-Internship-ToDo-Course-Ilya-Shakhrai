import React, { useState } from "react";
import { Todo } from "../../types";
import "./CompleteToDoList.css";
export const CompleteToDoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, title: "Learn React", completed: false },
    { id: 2, title: "Build Todo App", completed: true },
    { id: 3, title: "Write Tests", completed: false },
  ]);
  const [inputValue, setInputValue] = useState<string>("");

  const handleAddTodo = () => {
    if (!inputValue.trim()) return;
    const newTodo: Todo = {
      id: Date.now(),
      title: inputValue,
      completed: false,
    };
    setTodos([...todos, newTodo]);
    setInputValue("");
  };

  const markCompleted = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };
  return (
    <div>
      <ul>
        {todos.map((todo) => (
          <li className="toDoItem" key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => markCompleted(todo.id)}/>
            <span className={todo.completed ? "completed" : "uncompleted"}>
              {todo.title}
            </span>
          </li>
        ))}
      </ul>

      <form onSubmit={(e) => {e.preventDefault(); handleAddTodo();}} >
        <input
          type="text"
          placeholder="Add todo"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}></input>
        <button type="submit">Add</button>
      </form>
    </div>
  );
};
