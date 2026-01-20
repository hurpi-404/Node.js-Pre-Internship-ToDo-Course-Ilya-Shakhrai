# Task 4: Wire Up ToDo REST API

## Implementation
Express server with full CRUD operations for todos.
Includes validation middleware to ensure title exists.

## Endpoints
- GET /todos - List all todos
- POST /todos - Create todo (requires title)
- GET /todos/:id - Get specific todo
- PUT /todos/:id - Update todo (requires title)
- DELETE /todos/:id - Delete todo

## How to Run
```bash
npm install express
node app.js
```

## Test Examples
```bash
# Create todo
curl -X POST http://localhost:3000/todos -H "Content-Type: application/json" -d '{"title":"Buy milk"}'

# Get all todos
curl http://localhost:3000/todos

# Update todo
curl -X PUT http://localhost:3000/todos/1 -H "Content-Type: application/json" -d '{"title":"Buy milk","completed":true}'

# Delete todo
curl -X DELETE http://localhost:3000/todos/1

# Validation error
curl -X POST http://localhost:3000/todos -H "Content-Type: application/json" -d '{}'
# Response: {"error":"title is required and must be non-empty string"}
```
