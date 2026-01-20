-- =====================================================
-- Task 09: Implementing an Audit Log Trigger
-- =====================================================

-- =====================================================
-- STEP 1: Create the audit_log Table
-- =====================================================
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    todo_id INTEGER NOT NULL,
    action VARCHAR(50) NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- =====================================================
-- STEP 2: Create a Trigger Function for Updates
-- =====================================================
CREATE OR REPLACE FUNCTION log_todo_update()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log (todo_id, action)
    VALUES (NEW.id, 'UPDATE');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- =====================================================
-- Create the trigger for updates
-- =====================================================
CREATE TRIGGER trigger_todo_update
AFTER UPDATE ON todos
FOR EACH ROW
EXECUTE FUNCTION log_todo_update();
-- =====================================================
-- STEP 3: Create a Trigger Function for Deletes
-- =====================================================
CREATE OR REPLACE FUNCTION log_todo_delete()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log (todo_id, action)
    VALUES (OLD.id, 'DELETE');
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;
-- =====================================================
-- Trigger for deletes
-- =====================================================
CREATE TRIGGER trigger_todo_delete
BEFORE DELETE ON todos
FOR EACH ROW
EXECUTE FUNCTION log_todo_delete();