const express = require('express');
const app = express();

app.use(express.json());

let todos = [];
let nextId = 1;

const validateTodo = (req, res, next) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'title is required and must be non-empty string' });
  }
  next();
};

app.get('/todos', (req, res) => {
  res.json({ success: true, data: todos, count: todos.length });
});

app.post('/todos', validateTodo, (req, res) => {
  const todo = {
    id: nextId++,
    title: req.body.title.trim(),
    completed: req.body.completed || false,
    createdAt: new Date().toISOString()
  };
  todos.push(todo);
  res.status(201).json({ success: true, data: todo });
});

app.get('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  res.json({ success: true, data: todo });
});

app.put('/todos/:id', validateTodo, (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  
  todo.title = req.body.title.trim();
  if (req.body.completed !== undefined) todo.completed = req.body.completed;
  todo.updatedAt = new Date().toISOString();
  
  res.json({ success: true, data: todo });
});

app.delete('/todos/:id', (req, res) => {
  const index = todos.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Todo not found' });
  
  todos.splice(index, 1);
  res.json({ success: true, message: 'Todo deleted' });
});

app.listen(3000, () => console.log('Server on port 3000'));
