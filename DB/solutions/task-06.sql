-- =====================================================
-- Task 06: Indexes and Query Optimization (MySQL)
-- Environment: Windows 10, MySQL, TablePlus
-- =====================================================

-- =====================================================
-- 1. CREATE INDEX ON status COLUMN
-- =====================================================
CREATE INDEX idx_todos_status ON todos(status);
SHOW INDEX FROM todos;

-- =====================================================
-- 2. ANALYZE QUERY PERFORMANCE WITH EXPLAIN
-- =====================================================

EXPLAIN SELECT * FROM todos WHERE status = 'active';

SET profiling = 1;
SELECT * FROM todos WHERE status = 'active';
SHOW PROFILES;

CREATE INDEX idx_todos_user_id ON todos(user_id);

EXPLAIN SELECT * FROM todos WHERE status = 'active';

