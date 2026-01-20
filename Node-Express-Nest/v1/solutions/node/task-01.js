const EventEmitter = require("events");

/**
 * Custom Event Emitter for a messaging system
 * Extend Node.js EventEmitter to create a pub-sub messaging system
 */
class MessageSystem extends EventEmitter {
  constructor() {
    super();
    // Initialize the messaging system
    this.messages = [];
    this.users = new Set();
    this.messageId = 1;
    this.type = ["message", "notification", "alert"];
    this.rateLimits = new Map();
  }

  sendMessage(type, content, sender = "System") {
    const now = Date.now();
    const limit = this.rateLimits.get(sender);
    
    if (limit && now - limit < 1000) {
      this.emit('rate-limit-exceeded', { sender });
      return null;
    }
    
    this.rateLimits.set(sender, now);
    
    const message = {
      id: this.messageId++,
      type,
      content,
      timestamp: new Date().toISOString(),
      sender,
    };

    this.messages.push(message);
    this.messages = this.messages.slice(-100);

    this.emit("message", message);
    this.emit(type, message);

    return message;
  }

  subscribeToMessages(callback) {
    this.on("message", callback);
  }

  subscribeToType(type, callback) {
    this.on(type, callback);
  }

  getUserCount() {
    return this.users.size;
  }

  getMessageHistory(count = 10) {
    return this.messages.slice(-count);
  }

  addUser(username) {
    this.users.add(username);
    this.emit("user-joined", { content: `${username} joined` });
  }

  removeUser(username) {
    this.users.delete(username);
    this.emit("user-left", { content: `${username} left` });
  }

  getActiveUsers() {
    return Array.from(this.users);
  }

  clearHistory() {
    this.messages = [];
    this.emit("history-cleared");
  }

  getStats() {
    return {
      totalMessages: this.messages.length,
      activeUsers: this.users.size,
      messagesByType: {
        message: this.messages.filter(m => m.type === 'message').length,
        notification: this.messages.filter(m => m.type === 'notification').length,
        alert: this.messages.filter(m => m.type === 'alert').length
      }
    };
  }

  searchMessages(query) {
    return this.messages.filter(m => 
      m.content.toLowerCase().includes(query.toLowerCase()) ||
      m.sender.toLowerCase().includes(query.toLowerCase())
    );
  }

  filterByType(type) {
    return this.messages.filter(m => m.type === type);
  }

  filterBySender(sender) {
    return this.messages.filter(m => m.sender === sender);
  }
}

// Export the MessageSystem class
module.exports = MessageSystem;

// Example usage (for testing):
const isReadyToTest = true;

if (isReadyToTest) {
  const messenger = new MessageSystem();

  // Subscribe to all messages
  messenger.subscribeToMessages((message) => {
    console.log(`[${message.type.toUpperCase()}] ${message.content}`);
  });

  // Subscribe to specific alert messages
  messenger.subscribeToType("alert", (message) => {
    console.log(`🚨 ALERT: ${message.content}`);
  });

  // Subscribe to user events
  messenger.subscribeToType("user-joined", (message) => {
    console.log(`👋 ${message.content}`);
  });

  messenger.subscribeToType("user-left", (message) => {
    console.log(`👋 ${message.content}`);
  });

  // Add users
  messenger.addUser("Alice");
  messenger.addUser("Bob");

  // Send various messages
  messenger.sendMessage("message", "Hello everyone!", "Alice");
  messenger.sendMessage("notification", "System maintenance in 1 hour");
  messenger.sendMessage("alert", "Server overload detected!");

  // Remove user
  messenger.removeUser("Bob");

  // Check system status
  console.log(`\nActive users: ${messenger.getUserCount()}`);
  console.log("Recent messages:", messenger.getMessageHistory()?.length);
  console.log("System stats:", messenger.getStats());
}
