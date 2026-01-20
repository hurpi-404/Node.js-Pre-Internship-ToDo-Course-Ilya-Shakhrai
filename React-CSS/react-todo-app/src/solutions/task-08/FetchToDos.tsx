import React, { useState, useEffect } from "react";
import { Todo } from "../../types";

export const FetchToDos: React.FC = () => {
  const API_URL = "https://jsonplaceholder.typicode.com/todos";
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fechData = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setTodos(data.slice(0, 5));
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        setLoading(false);
      }
    };
    fechData();
  }, []);
  
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <ul>
          {todos.map((todo) => (
            <li style={{ listStyle: "none" }} key={todo.id}>
              {todo.title} - {todo.completed ? "✓" : "✗"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
