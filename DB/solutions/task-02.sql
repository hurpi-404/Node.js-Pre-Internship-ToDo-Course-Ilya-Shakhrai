-- =====================================================
-- Task 02: Basic CRUD Operations on "todos" Table (MySQL)
-- Environment: Windows 10, MySQL, TablePlus
-- =====================================================

-- TABLEPLUS COMMANDS:
-- -------------------------------
-- Opened TablePlus, connected to the MySQL (localhost, root, password)
-- Created new Query (Ctrl+N)
-- =====================================================
-- 1. CREATE (Insert a new todo)
-- =====================================================

INSERT INTO users (username, email) 
VALUES ('john_doe', 'john@example.com');

INSERT INTO todos (title, description, status, user_id) 
VALUES ('Buy groceries', 'Milk, eggs, bread, and butter', 'active', 1);

INSERT INTO todos (title, description, status, user_id) 
VALUES ('Learn SQL', 'Complete Tasks 1 and 2', 'active', 1),
       ('Write report', 'Monthly progress report', 'completed', 1);  

-- =====================================================
-- 2. READ (Select all todos)
-- =====================================================
SELECT * FROM todos;
SELECT todos.*, users.username 
FROM todos 
JOIN users ON todos.user_id = users.id;

-- =====================================================
-- 3. UPDATE (Change the status of a specific todo)
-- =====================================================
UPDATE todos 
SET status = 'completed' 
WHERE id = 1;

-- Проверим изменение:
SELECT id, title, status FROM todos WHERE id = 1;

-- =====================================================
-- 4. DELETE (Remove a todo by its id)
-- =====================================================
DELETE FROM todos 
WHERE id = 2;
SELECT * FROM todos;
