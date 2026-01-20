const { error } = require("console");
const http = require("http");
const url = require("url");

/**
 * Todo REST API Server
 * Built with Node.js built-in HTTP module
 * Supports full CRUD operations with in-memory storage
 */

/**
 * Parse JSON request body from HTTP request
 * @param {IncomingMessage} req - HTTP request object
 * @returns {Promise<Object>} Parsed JSON data
 */
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunck) => (body += chunck.toString()));
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

/**
 * Extract path parameters from URL pattern
 * @param {string} pattern - URL pattern like '/todos/:id'
 * @param {string} path - Actual path like '/todos/123'
 * @returns {Object} Extracted parameters like { id: "123" }
 */
function parsePathParams(pattern, path) {
  // TODO: Implement path parameter extraction
  // 1. Split pattern and path by '/'
  // 2. Find segments that start with ':'
  // 3. Extract corresponding values from path
  // 4. Return object with parameter names and values
  // 5. Handle edge cases (no params, mismatched segments)

  const params = {};

  const patternParts = pattern.split("/");
  const pathParts = path.split("/");

  patternParts.forEach((part, index) => {
    if (part.startsWith(":")) {
      const paramName = part.slice(1);
      params[paramName] = pathParts[index];
    }
  });

  return params;
}

/**
 * Send consistent JSON response
 * @param {ServerResponse} res - HTTP response object
 * @param {number} statusCode - HTTP status code
 * @param {Object} data - Response data
 */
function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data));
}

/**
 * Validate todo data according to business rules
 * @param {Object} todoData - Todo data to validate
 * @param {boolean} isUpdate - Whether this is an update operation
 * @returns {Object} Validation result with errors array
 */
function validateTodo(todoData, isUpdate = false) {
  const validationErrors = [];

  if (!isUpdate && !todoData.title) {
    validationErrors.push("Title is required");
  }
  if (todoData.title !== undefined) {
    if (typeof todoData.title !== "string") {
      validationErrors.push("title must be a string");
    } else if (todoData.title.trim().length === 0) {
      validationErrors.push("title cannot be empty");
    } else if (todoData.title.length > 100) {
      validationErrors.push("title cannot exceed 100 characters");
    }
  }

  if (todoData.description !== undefined) {
    if (typeof todoData.description !== "string") {
      validationErrors.push("description must be a string");
    } else if (todoData.description.length > 500) {
      validationErrors.push("description cannot exceed 500 characters");
    }
  }

  if (todoData.completed !== undefined) {
    if (typeof todoData.completed !== "boolean") {
      validationErrors.push("completed must be a boolean");
    }
  }
  return { isValid: validationErrors.length === 0, validationErrors };
}

/**
 * TodoServer Class - Main HTTP server for Todo API
 */
class TodoServer {
  constructor(port = 3000) {
    this.nextId = 1;
    this.port = port;
    this.todos = [];
    this.initializeSampleData();
  }

  /**
   * Initialize server with sample todo data
   */
  initializeSampleData() {
    this.todos = [
      {
        id: this.nextId++,
        title: "Sample Todo 1",
        description: "This is a sample todo item",
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: this.nextId++,
        title: "Sample Todo 2",
        description: "Another sample todo item",
        completed: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  /**
   * Start the HTTP server
   */
  start() {
    const server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });

    server.listen(this.port, () => {
      console.log(`Todo Server listening on port ${this.port}`);
    });

    server.on("error", (error) => {
      console.error("Server error:", error);
    });
  }

  /**
   * Main request handler - routes requests to appropriate methods
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   */
  async handleRequest(req, res) {
    try {
      const parsedUrl = url.parse(req.url, true);
      const { pathname, query } = parsedUrl;
      const method = req.method;

      if (method === "OPTIONS") {
        this.handleCORS(req, res);
        return;
      }

      if (pathname === "/todos") {
        if (req.method === "GET") {
          await this.getAllTodos(req, res, query);
          return;
        }
        if (req.method === "POST") {
          await this.createTodo(req, res);
          return;
        }
      }

      if (pathname.startsWith("/todos/")) {
        const params = parsePathParams("/todos/:id", pathname);

        if (method === "GET") {
          await this.getTodoById(req, res, params);
          return;
        }
        if (method === "PUT") {
          await this.updateTodo(req, res, params);
          return;
        }
        if (method === "DELETE") {
          await this.deleteTodo(req, res, params);
          return;
        }
      }

      sendResponse(res, 404, {
        success: false,
        error: "Route not found",
      });
    } catch (error) {
      console.error("Request handling error:", error);
      sendResponse(res, 500, {
        success: false,
        error: "Internal server error",
      });
    }
  }

  /**
   * Handle GET /todos - Get all todos with optional filtering
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   * @param {Object} query - URL query parameters
   */
  async getAllTodos(req, res, query) {
    let todos = this.todos;

    if (query.completed !== undefined) {
      const completedFilter = query.completed.toLowerCase() === "true";
      todos = todos.filter((todo) => todo.completed === completedFilter);
    }

    sendResponse(res, 200, {
      success: true,
      data: todos,
      count: todos.length,
    });
    // TODO: Implement get all todos with filtering
    // 4. Handle query parameter validation
  }

  /**
   * Handle GET /todos/:id - Get specific todo by ID
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   * @param {Object} params - Path parameters
   */
  async getTodoById(req, res, params) {
    const searchId = parseInt(params.id, 10);
    if (isNaN(searchId)) {
      sendResponse(res, 400, { success: false, error: "Invalid todo ID" });
      return;
    }

    const todo = this.todos.find((todo) => todo.id === searchId);

    if (!todo) {
      sendResponse(res, 404, { success: false, error: "Todo not found" });
      return;
    }

    sendResponse(res, 200, { success: true, data: todo });
  }

  /**
   * Handle POST /todos - Create new todo
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   */
  async createTodo(req, res) {
    const data = await parseBody(req);
    const { isValid, validationErrors } = validateTodo(data);
    if (!isValid) {
      sendResponse(res, 400, { success: false, errors: validationErrors });
      return;
    }

    const newTodo = {
      id: this.generateNextId(),
      title: data.title,
      description: data.description,
      completed: data.completed || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.todos.push(newTodo);

    sendResponse(res, 201, { success: true, data: newTodo });
  }

  /**
   * Handle PUT /todos/:id - Update existing todo
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   * @param {Object} params - Path parameters
   */
  async updateTodo(req, res, params) {
    const id = parseInt(params.id, 10);
    const todo = this.findTodoById(id);

    if (!todo) {
      sendResponse(res, 404, { success: false, error: "Todo not found" });
      return;
    }

    const data = await parseBody(req);

    const { isValid, validationErrors } = validateTodo(data, true);
    if (!isValid) {
      sendResponse(res, 400, { success: false, errors: validationErrors });
      return;
    }

    if (data.title !== undefined) todo.title = data.title;
    if (data.description !== undefined) todo.description = data.description;
    if (data.completed !== undefined) todo.completed = data.completed;
    todo.updatedAt = new Date().toISOString();

    sendResponse(res, 200, { success: true, data: todo });
  }

  /**
   * Handle DELETE /todos/:id - Delete todo
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   * @param {Object} params - Path parameters
   */
  async deleteTodo(req, res, params) {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      sendResponse(res, 400, { success: false, error: "Invalid ID format" });
    }

    const index = this.findTodoIndexById(id);
    if (index === -1) {
      sendResponse(res, 404, { success: false, error: "Todo not found" });
      return;
    }

    this.todos.splice(index, 1);

    sendResponse(res, 200, {
      success: true,
      message: "Todo deleted successfully",
    });
  }

  /**
   * Handle CORS preflight requests
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   */
  handleCORS(req, res) {
    // why do we even need this if we already hande CORS in sendResponse func??
    sendResponse(res, 204, {});
  }

  /**
   * Find todo by ID in storage
   * @param {number|string} id - Todo ID
   * @returns {Object|null} Found todo or null
   */
  findTodoById(id) {
    const numId = parseInt(id, 10);

    if (isNaN(numId)) {
      console.error("Invalid ID format");
      return null;
    }

    return this.todos.find((todo) => todo.id === numId) || null;
  }

  /**
   * Find todo index by ID in storage
   * @param {number|string} id - Todo ID
   * @returns {number} Todo index or -1 if not found
   */
  findTodoIndexById(id) {
    const numId = parseInt(id, 10);

    const todos = this.todos;

    let index = 0;
    for (const todo of todos) {
      if (todo.id === numId) {
        return index;
      }
      index++;
    }

    return -1;
  }

  /**
   * Generate next available ID
   * @returns {number} Next ID
   */
  generateNextId() {
    return this.nextId++;
  }
}

// Export the TodoServer class
module.exports = TodoServer;

// Example usage (for testing):
const isReadyToTest = true;

if (isReadyToTest) {
  // Start server for testing
  const server = new TodoServer(3000);
  server.start();

  console.log("🚀 Todo Server starting...");
  console.log("📝 Replace TODO comments with implementation");
  console.log("🧪 Run task-04-test.js to verify functionality");
}

// If this file is run directly, start the server
if (require.main === module) {
  const server = new TodoServer(3000);
  server.start();
}
