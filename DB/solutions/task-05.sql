-- =====================================================
-- Task 05: Aggregation and Grouping in SQL (MySQL)
-- Environment: Windows 10, MySQL, TablePlus
-- =====================================================

INSERT INTO users (name, email) VALUES
('Anna', 'anna@example.com'),
('Boris', 'boris@example.com'),
('Victoria', 'victoria@example.com');

INSERT INTO todos (title, description, status, user_id) VALUES
('buy milk', 'on the pervaya street', 'active', 1),
('Give results', 'before friday', 'completed', 1),
('Call the client', '124-221-555 number', 'active', 2),
('Prepare the meeting', 'with company', 'completed', 2),
('Write a documentation', 'project ', 'completed', 2);

-- =====================================================
-- 1. COUNT TODOS BY STATUS
-- =====================================================

SELECT status, COUNT(*) AS count
FROM todos
GROUP BY status;

-- Пример вывода:
-- | status    | count |
-- | active    |     2 |
-- | completed |     3 |

-- =====================================================
-- 2. COUNT TODOS PER USER 
-- =====================================================

SELECT 
    users.name, 
    users.email, 
    COUNT(todos.id) AS todo_count
FROM users
LEFT JOIN todos ON users.id = todos.user_id
GROUP BY users.id, users.name, users.email;

-- result:
-- | name       | email               | todo_count |
-- | Anna       | anna@example.com    |          2 |
-- | Boris      | boris@example.com   |          3 |
-- | Victoria   | victoria@example.com|          0 |

-- =====================================================
-- 3. FIND USERS WITH NO TODOS
-- =====================================================

SELECT users.name, users.email
FROM users
LEFT JOIN todos ON users.id = todos.user_id
WHERE todos.id IS NULL;

-- | name       | email               |
-- | Victoria   | victoria@example.com|
