-- ============================================
-- V2__seed_data.sql
-- VacationManager - Seed Data
-- ============================================

-- ============================================
-- USERS (Passwords hashed with BCrypt - cost 10)
-- Admin123! / Manager123! / Collab123!
-- Generated with: BCrypt.hashpw(password, BCrypt.gensalt(10))
-- ============================================
INSERT INTO users (id, email, password_hash, role) VALUES
    ('11111111-1111-1111-1111-111111111111', 'admin@lbc.local', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOWpn/TgcHT0y1YbZ0WQCQMbf3h.FCGF6', 'ADMIN'),
    ('22222222-2222-2222-2222-222222222222', 'manager@lbc.local', '$2a$10$Dow7fMqMQu/4xPTnN.GxeOaK8WBhKgk0bFJTJZ7W0CFDIv9YPGwxu', 'MANAGER'),
    ('33333333-3333-3333-3333-333333333333', 'collab@lbc.local', '$2a$10$L7LMPM/xTKl4RR3WMvHVr.F4rPrVx4FmqRvQzVZZJmG9OZq6Z7i.S', 'COLLABORATOR');

-- ============================================
-- EMPLOYEES (10 total)
-- ============================================
-- Employee linked to collaborator user
INSERT INTO employees (id, full_name, email, manager_id, user_id, active) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Carlos Silva', 'carlos.silva@empresa.com', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', true);

-- 7 employees linked to manager
INSERT INTO employees (id, full_name, email, manager_id, user_id, active) VALUES
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Ana Oliveira', 'ana.oliveira@empresa.com', '22222222-2222-2222-2222-222222222222', NULL, true),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Pedro Santos', 'pedro.santos@empresa.com', '22222222-2222-2222-2222-222222222222', NULL, true),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Maria Costa', 'maria.costa@empresa.com', '22222222-2222-2222-2222-222222222222', NULL, true),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'João Ferreira', 'joao.ferreira@empresa.com', '22222222-2222-2222-2222-222222222222', NULL, true),
    ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Sofia Martins', 'sofia.martins@empresa.com', '22222222-2222-2222-2222-222222222222', NULL, true),
    ('00000000-0000-0000-0000-000000000001', 'Ricardo Almeida', 'ricardo.almeida@empresa.com', '22222222-2222-2222-2222-222222222222', NULL, true),
    ('00000000-0000-0000-0000-000000000002', 'Beatriz Rodrigues', 'beatriz.rodrigues@empresa.com', '22222222-2222-2222-2222-222222222222', NULL, true);

-- 2 employees without manager (admin manages)
INSERT INTO employees (id, full_name, email, manager_id, user_id, active) VALUES
    ('00000000-0000-0000-0000-000000000003', 'Miguel Pereira', 'miguel.pereira@empresa.com', NULL, NULL, true),
    ('00000000-0000-0000-0000-000000000004', 'Inês Gomes', 'ines.gomes@empresa.com', NULL, NULL, true);

-- ============================================
-- VACATION BALANCES (2026)
-- ============================================
INSERT INTO vacation_balances (employee_id, year, entitled_days, used_days, remaining_days) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2026, 22, 5, 17),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 2026, 22, 10, 12),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 2026, 22, 0, 22),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 2026, 22, 0, 22),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 2026, 22, 0, 22),
    ('ffffffff-ffff-ffff-ffff-ffffffffffff', 2026, 22, 0, 22),
    ('00000000-0000-0000-0000-000000000001', 2026, 22, 0, 22),
    ('00000000-0000-0000-0000-000000000002', 2026, 22, 0, 22),
    ('00000000-0000-0000-0000-000000000003', 2026, 22, 0, 22),
    ('00000000-0000-0000-0000-000000000004', 2026, 22, 0, 22);

-- ============================================
-- VACATION REQUESTS
-- 2 APPROVED, 2 PENDING, 1 REJECTED, 1 CANCELLED
-- ============================================

-- APPROVED #1 - Carlos Silva (Jan 2026)
INSERT INTO vacation_requests (id, employee_id, start_date, end_date, status, decision_at, decided_by_user_id, reason) VALUES
    ('10000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-01-15', '2026-01-19', 'APPROVED', '2026-01-10 10:00:00', '22222222-2222-2222-2222-222222222222', 'Descanso de início de ano');

-- APPROVED #2 - Ana Oliveira (Feb 2026)
INSERT INTO vacation_requests (id, employee_id, start_date, end_date, status, decision_at, decided_by_user_id, reason) VALUES
    ('10000000-0000-0000-0000-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2026-02-01', '2026-02-10', 'APPROVED', '2026-01-20 14:00:00', '22222222-2222-2222-2222-222222222222', 'Viagem em família');

-- PENDING #1 - Pedro Santos (Mar 2026)
INSERT INTO vacation_requests (id, employee_id, start_date, end_date, status, reason) VALUES
    ('10000000-0000-0000-0000-000000000003', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '2026-03-10', '2026-03-20', 'PENDING', 'Férias de Páscoa');

-- PENDING #2 - Maria Costa (Mar 2026) - Overlapping with Pedro's request for testing
INSERT INTO vacation_requests (id, employee_id, start_date, end_date, status, reason) VALUES
    ('10000000-0000-0000-0000-000000000004', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '2026-03-15', '2026-03-25', 'PENDING', 'Visita a familiares');

-- REJECTED - João Ferreira
INSERT INTO vacation_requests (id, employee_id, start_date, end_date, status, decision_at, decided_by_user_id, reason, manager_comment) VALUES
    ('10000000-0000-0000-0000-000000000005', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '2026-04-01', '2026-04-15', 'REJECTED', '2026-03-15 09:00:00', '22222222-2222-2222-2222-222222222222', 'Férias prolongadas', 'Período coincide com entrega de projeto importante. Por favor reagendar.');

-- CANCELLED - Sofia Martins
INSERT INTO vacation_requests (id, employee_id, start_date, end_date, status, reason) VALUES
    ('10000000-0000-0000-0000-000000000006', 'ffffffff-ffff-ffff-ffff-ffffffffffff', '2026-05-01', '2026-05-10', 'CANCELLED', 'Mudança de planos pessoais');

-- ============================================
-- AUDIT LOGS (sample entries)
-- ============================================
INSERT INTO audit_logs (actor_user_id, action, entity_type, entity_id, metadata) VALUES
    ('22222222-2222-2222-2222-222222222222', 'APPROVE_VACATION', 'VacationRequest', '10000000-0000-0000-0000-000000000001', '{"employeeName": "Carlos Silva", "startDate": "2026-01-15", "endDate": "2026-01-19"}'),
    ('22222222-2222-2222-2222-222222222222', 'APPROVE_VACATION', 'VacationRequest', '10000000-0000-0000-0000-000000000002', '{"employeeName": "Ana Oliveira", "startDate": "2026-02-01", "endDate": "2026-02-10"}'),
    ('22222222-2222-2222-2222-222222222222', 'REJECT_VACATION', 'VacationRequest', '10000000-0000-0000-0000-000000000005', '{"employeeName": "João Ferreira", "reason": "Período coincide com entrega de projeto importante"}');
