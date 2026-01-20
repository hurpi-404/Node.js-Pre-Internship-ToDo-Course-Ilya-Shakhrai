-- =====================================================
-- Task 01: Installation and creation of users and todos tables
-- Environment: Windows 10, MySQL, TablePlus
-- =====================================================

-- 1. INSTALLATION
-- -------------------------------------------------
-- MySQL
--   1. Downloaded the installer and ran it
--   2. Installed all components and chose "Development computer" configuration
--   3. Left default port 3306, allowed access through Windows Firewall
--   4. Set root password, Windows service name MySQL80, default permissions, log location
--   5. Installation completed, MySQL Server running as a Windows service
--
-- TablePlus installation:
--   1. Downloaded the installer
--   2. Ran TablePlus Setup.exe
--   3. After TablePlus installation, clicked "Create connection"
--   4. Selected MySQL and entered:
--        Host: 127.0.0.1
--        Port: 3306
--        User: root
--   5. Clicked "Test" -> "Connect"

-- 2. CREATE DATABASE (run in TablePlus or command line)
-- -------------------------------------------------
-- Open Query in TablePlus (Cmd+N) and execute:
-- New query -> Name: creation
CREATE DATABASE todo_app;
USE todo_app;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_status CHECK (status IN ('active', 'completed'))
) ENGINE=InnoDB;

-- Query 1: OK
-- Query 2: OK
-- Query 3: OK
-- Query 4: OK

-- 3. ПРОВЕРКА СТРУКТУРЫ ТАБЛИЦ
-- -------------------------------------------------

-- todos:
-- +-------------+-------------+------+-----+-------------------+-------------------+
-- | Field       | Type        | Null | Key | Default           | Extra             |
-- +-------------+-------------+------+-----+-------------------+-------------------+
-- | id          | int         | NO   | PRI | NULL              | auto_increment    |
-- | title       | text        | NO   |     | NULL              |                   |
-- | description | text        | YES  |     | NULL              |                   |
-- | status      | text        | NO   |     | active            |                   |
-- | created_at  | timestamp   | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
-- | user_id     | int         | NO   | MUL | NULL              |                   |
-- +-------------+-------------+------+-----+-------------------+-------------------+

-- Users: ID    USERNAME    EMAIL   CREATED_AT

-- =====================================================