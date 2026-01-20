-- =====================================================
-- Task 03: Filtering and Sorting Todos with Raw SQL (MySQL)
-- Environment: Windows 10, MySQL, TablePlus
-- =====================================================

-- TABLEPLUS COMMANDS:
-- =====================================================
-- 1. FILTER BY STATUS
-- =====================================================

--(status = 'active')
SELECT * FROM todos 
WHERE status = 'active';

--(status = 'completed')
SELECT * FROM todos 
WHERE status = 'completed';

-- =====================================================
-- 2. SORT BY CREATION DATE
-- =====================================================

SELECT * FROM todos 
ORDER BY created_at ASC;

SELECT * FROM todos 
ORDER BY created_at DESC;

-- =====================================================
-- 3. SEARCH BY KEYWORD (case‑insensitive)
-- =====================================================

SELECT * FROM todos 
WHERE title LIKE '%meeting%' OR description LIKE '%meeting%';
