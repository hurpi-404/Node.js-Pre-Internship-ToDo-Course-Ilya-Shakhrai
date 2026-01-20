/**
 * task-05.js
 * Extend your Task 04 server by adding EventEmitter functionality,
 * logging, analytics, and new endpoints.
 *
 * Implement all TODOs below.
 */

const http = require("http");
const url = require("url");
const { EventEmitter } = require("events");

// ---------- Utilities ----------

function sendJson(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(data);
}

function parseIdFromPath(pathname) {
  const m = pathname.match(/^\/todos\/(\d+)$/);
  return m ? Number(m[1]) : null;
}

async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      if (!data) return resolve({});
      try {
        const json = JSON.parse(data);
        resolve(json);
      } catch (e) {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function nowISO() {
  return new Date().toISOString();
}

// ---------- Analytics ----------

class AnalyticsTracker {
  constructor() {
    this.stats = {
      totalCreated: 0,
      totalUpdated: 0,
      totalDeleted: 0,
      totalViews: 0,
      errors: 0,
      dailyStats: {},
    };
  }
  _bumpDaily(field) {
    const date = new Date().toISOString().split("T")[0];
    if (!this.stats.dailyStats[date]) {
      this.stats.dailyStats[date] = {
        created: 0,
        updated: 0,
        deleted: 0,
        views: 0,
      };
    }
    this.stats.dailyStats[date][field]++;
  }
  trackCreated() {
    this.stats.totalCreated++;
    this._bumpDaily("created");
  }
  trackUpdated() {
    this.stats.totalUpdated++;
    this._bumpDaily("updated");
  }
  trackDeleted() {
    this.stats.totalDeleted++;
    this._bumpDaily("deleted");
  }
  trackViewed() {
    this.stats.totalViews++;
    this._bumpDaily("views");
  }
  trackError() {
    this.stats.errors++;
  }
  getStats() {
    return this.stats;
  }
}

// ---------- Console Logger ----------
class ConsoleLogger {
  todoCreated(data) {
    console.log(
      `📝 [${data.timestamp}] Created "${data.todo.title}" (ID: ${data.todo.id})`,
    );
  }
  todoUpdated(data) {
    console.log(
      `✏️  [${data.timestamp}] Updated ID ${
        data.newTodo.id
      }; changed: ${data.changes.join(", ")}`,
    );
  }
  todoDeleted(data) {
    console.log(
      `🗑️  [${data.timestamp}] Deleted "${data.todo.title}" (ID: ${data.todo.id})`,
    );
  }
  todoViewed(data) {
    console.log(`👁️  [${data.timestamp}] Viewed ID ${data.todo.id}`);
  }
  todosListed(data) {
    console.log(`📃 [${data.timestamp}] Listed todos count=${data.count}`);
  }
  todoNotFound(data) {
    console.warn(
      `⚠️  [${data.timestamp}] Not found: id=${data.todoId} op=${data.operation}`,
    );
  }
  validationError(data) {
    console.error(
      `❌ [${data.timestamp}] Validation error: ${data.errors.join(", ")}`,
    );
  }
  serverError(data) {
    console.error(
      `💥 [${data.timestamp}] Server error in ${data.operation}: ${
        data.error && data.error.message
      }`,
    );
  }
}

// ---------- Validation ----------
function validateTodoPayload(payload, isCreate = false) {
  const errors = [];
  const out = {};

  if (isCreate) {
    if (!payload.title || typeof payload.title !== "string") {
      errors.push("title is required and must be a non-empty string");
    } else {
      out.title = payload.title.trim();
    }
  } else {
    if (payload.title !== undefined) {
      if (typeof payload.title !== "string" || payload.title.trim() === "") {
        errors.push("title must be a non-empty string");
      } else {
        out.title = payload.title.trim();
      }
    }
  }

  if (
    payload.description !== undefined &&
    (typeof payload.description !== "string" ||
      payload.description.length > 500)
  ) {
    errors.push("description must be a string no longer than 500 characters");
  } else if (payload.description !== undefined) {
    out.description = payload.description;
  }

  if (
    payload.completed !== undefined &&
    typeof payload.completed !== "boolean"
  ) {
    errors.push("completed must be a boolean");
  } else if (payload.completed !== undefined) {
    out.completed = payload.completed;
  }

  return { errors, values: out };
}

class TodoServer extends EventEmitter {
  constructor(port = 3000) {
    super();
    this.port = port;
    this.todos = [];
    this.nextId = 1;
    this.analytics = new AnalyticsTracker();
    this.logger = new ConsoleLogger();
    this.recentEvents = [];
    this.server = null;

    this._wireDefaultListeners();
  }

  _wireDefaultListeners() {
    const remember = (eventType) => (data) => {
      this.recentEvents.push({ eventType, timestamp: nowISO(), data });
      if (this.recentEvents.length > 100) this.recentEvents.shift();
    };
    // Remember all key events for /events
    [
      "todoCreated",
      "todoUpdated",
      "todoDeleted",
      "todoViewed",
      "todosListed",
      "todoNotFound",
      "validationError",
      "serverError",
    ].forEach((evt) => this.on(evt, remember(evt)));

    // Logging
    this.on("todoCreated", (d) => this.logger.todoCreated(d));
    this.on("todoUpdated", (d) => this.logger.todoUpdated(d));
    this.on("todoDeleted", (d) => this.logger.todoDeleted(d));
    this.on("todoViewed", (d) => this.logger.todoViewed(d));
    this.on("todosListed", (d) => this.logger.todosListed(d));
    this.on("todoNotFound", (d) => this.logger.todoNotFound(d));
    this.on("validationError", (d) => this.logger.validationError(d));
    this.on("serverError", (d) => this.logger.serverError(d));

    // Analytics
    this.on("todoCreated", () => this.analytics.trackCreated());
    this.on("todoUpdated", () => this.analytics.trackUpdated());
    this.on("todoDeleted", () => this.analytics.trackDeleted());
    this.on("todoViewed", () => this.analytics.trackViewed());
    this.on("validationError", () => this.analytics.trackError());
    this.on("serverError", () => this.analytics.trackError());
  }

  /**
   * Start the server
   */
  async start() {
    this.server = http.createServer((req, res) =>
      this._handleRequest(req, res),
    );
    return new Promise((resolve) => {
      this.server.listen(this.port, () => resolve());
    });
  }

  /**
   * Stop the server
   */
  async stop() {
    if (this.server) {
      return new Promise((resolve) => this.server.close(() => resolve()));
    }
  }

  /**
   * Handle incoming requests
   */
  async _handleRequest(req, res) {
    if (req.method === "OPTIONS") {
      sendJson(res, 204, {});
      return;
    }

    const parsedUrl = url.parse(req.url, true);
    const { pathname, query } = parsedUrl;
    const method = req.method;

    try {
      if (pathname === "/todos") {
        if (method === "GET") {
          let todos = this.todos;
          if (query.completed !== undefined) {
            const isCompleted = query.completed.toLowerCase() === "true";
            todos = todos.filter((todo) => todo.completed === isCompleted);
          }
          this.emit("todosListed", {
            timestamp: nowISO(),
            count: todos.length,
          });
          sendJson(res, 200, {
            success: true,
            data: todos,
            count: todos.length,
          });
          return;
        }
        if (method === "POST") {
          let data;
          try {
            data = await parseBody(req);
          } catch (err) {
            this.emit("validationError", { timestamp: nowISO(), errors: [err.message] });
            sendJson(res, 400, { success: false, error: err.message });
            return;
          }

          const { errors, values } = validateTodoPayload(data, true);

          if (errors.length > 0) {
            this.emit("validationError", { timestamp: nowISO(), errors });
            sendJson(res, 400, { success: false, errors });
            return;
          }

          const newTodo = {
            id: this.nextId++,
            title: values.title,
            description: values.description || "",
            completed: values.completed || false,
            createdAt: nowISO(),
            updatedAt: nowISO(),
          };
          this.todos.push(newTodo);
          this.emit("todoCreated", { timestamp: nowISO(), todo: newTodo });
          sendJson(res, 201, { success: true, data: newTodo });
          return;
        }
      }

      const id = parseIdFromPath(pathname);
      if (id !== null) {
        const todo = this.todos.find((t) => t.id === id);
        if (!todo) {
          this.emit("todoNotFound", {
            timestamp: nowISO(),
            todoId: id,
            operation: method,
          });
          sendJson(res, 404, { success: false, error: "Todo not found" });
          return;
        }
        if (method === "GET") {
          this.emit("todoViewed", { timestamp: nowISO(), todo });
          sendJson(res, 200, { success: true, data: todo });
          return;
        }
        if (method === "PUT") {
          let data;
          try {
            data = await parseBody(req);
          } catch (err) {
            this.emit("validationError", { timestamp: nowISO(), errors: [err.message] });
            sendJson(res, 400, { success: false, error: err.message });
            return;
          }

          const { errors, values } = validateTodoPayload(data, false);

          if (errors.length > 0) {
            this.emit("validationError", { timestamp: nowISO(), errors });
            sendJson(res, 400, { success: false, errors });
            return;
          }

          const changes = [];

          if (values.title !== undefined) {
            todo.title = values.title;
            changes.push("title");
          }
          if (values.description !== undefined) {
            todo.description = values.description;
            changes.push("description");
          }
          if (values.completed !== undefined) {
            todo.completed = values.completed;
            changes.push("completed");
          }
          todo.updatedAt = nowISO();

          this.emit("todoUpdated", {
            timestamp: nowISO(),
            newTodo: todo,
            changes,
          });
          sendJson(res, 200, { success: true, data: todo });
          return;
        }

        if (method === "DELETE") {
          this.todos = this.todos.filter((t) => t.id !== id);
          this.emit("todoDeleted", { timestamp: nowISO(), todo });
          sendJson(res, 200, {
            success: true,
            message: "Todo deleted successfully",
          });
          return;
        }
      }

      if (method === "GET") {
        if (pathname === "/events") {
          const limit = query.last ? parseInt(query.last, 10) : 10;
          const events = this.recentEvents.slice(-limit);
          sendJson(res, 200, { success: true, data: events });
          return;
        }
        if (pathname === "/analytics") {
          sendJson(res, 200, { success: true, data: this.analytics.getStats() });
          return;
        }
      }

      sendJson(res, 404, { success: false, error: "Not found" });
    } catch (err) {
      this.emit("serverError", {
        timestamp: nowISO(),
        error: err,
        operation: method + " " + pathname,
      });
      sendJson(res, 500, { success: false, error: "Internal server error" });
    }
  }
}

module.exports = { TodoServer };
