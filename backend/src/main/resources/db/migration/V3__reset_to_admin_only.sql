-- ============================================
-- V3__reset_to_admin_only.sql
-- Reset database - Keep only Admin user
-- ============================================

-- Delete all audit logs
DELETE FROM audit_logs;

-- Delete all vacation balances
DELETE FROM vacation_balances;

-- Delete all vacation requests
DELETE FROM vacation_requests;

-- Delete all employees
DELETE FROM employees;

-- Delete all users except admin
DELETE FROM users WHERE role != 'ADMIN';

-- Ensure admin exists with correct credentials
-- Password: Admin123!
INSERT INTO users (id, email, password_hash, role)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'admin@lbc.local',
    '$2a$10$8K1p/a0dL1LXMIgoEDFrwOWpn/TgcHT0y1YbZ0WQCQMbf3h.FCGF6',
    'ADMIN'
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role;
