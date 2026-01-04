#!/usr/bin/env node

import { ToDoManager } from './todo-manager';

async function main() {
  const manager = new ToDoManager();
  const command = process.argv[2];
  const args = process.argv.slice(3);

  try {
    switch (command) {
      case 'init':
        await manager.init();
        console.log('Demo data has been seeded');
        break;

      case 'add':
        if (!args[0]) {
          console.error('Error: Title is required');
          console.log('Usage: npm start add "Task title" [description]');
          process.exit(1);
        }
        await manager.add(args[0], args[1] || '');
        console.log(`Task added: "${args[0]}"`);
        break;

      case 'complete':
        if (!args[0]) {
          console.error('Error: Task ID is required');
          console.log('Usage: npm start complete <id>');
          process.exit(1);
        }
        const id = parseInt(args[0], 10);
        if (isNaN(id)) {
          console.error('Error: ID must be a number');
          process.exit(1);
        }
        await manager.complete(id);
        console.log(`Task ${id} marked as completed`);
        break;

      case 'list':
        const todos = await manager.list();
        if (todos.length === 0) {
          console.log('No tasks found');
        } else {
          console.log('\nYour ToDo List:');
          console.log('─'.repeat(50));
          todos.forEach(todo => {
            const statusIcon = todo.status === 'COMPLETED' ? '✓' : '○';
            const idStr = todo.id.toString().padStart(3, ' ');
            const statusStr = todo.status.padEnd(12, ' ');
            console.log(` ${statusIcon} [${idStr}] ${todo.title}`);
            if (todo.description) {
              console.log(`      ${todo.description}`);
            }
            console.log(`      Status: ${statusStr} | Created: ${todo.createdAt.toLocaleDateString()}`);
            console.log('─'.repeat(50));
          });
        }
        break;

      case 'help':
      case undefined:
        console.log(`
ToDo Manager CLI - Usage:
  npm start init                    - Seed with demo data
  npm start add <title> [desc]      - Add a new task
  npm start complete <id>           - Mark task as completed
  npm start list                    - List all tasks
  npm start help                    - Show this help

Examples:
  npm start add "Buy milk" "2% fat"
  npm start complete 1
  npm start list
        `);
        break;

      default:
        console.error(`Unknown command: ${command}`);
        console.log('Use "npm start help" for usage information');
        process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

main();