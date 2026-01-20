-- =====================================================
-- Task 04: Creating a Users Table and Linking Todos to Users with a Foreign Key (MySQL)
-- Environment: Windows 10, MySQL, TablePlus

-- =====================================================
-- 1. CREATE THE users TABLE (если ещё не существует)
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =====================================================
-- 2. ALTER THE todos TABLE (добавить user_id и внешний ключ)
-- =====================================================
-- new key (ON DELETE CASCADE — when we delete user all his tasks delete too)
ALTER TABLE todos 
ADD CONSTRAINT fk_todos_user 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

DESCRIBE users;

DESCRIBE todos;

SELECT 
    CONSTRAINT_NAME, 
    TABLE_NAME, 
    COLUMN_NAME, 
    REFERENCED_TABLE_NAME, 
    REFERENCED_COLUMN_NAME
FROM 
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE 
    CONSTRAINT_SCHEMA = 'todo_app' 
    AND REFERENCED_TABLE_NAME IS NOT NULL;
-- =====================================================