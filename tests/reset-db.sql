-- reset-db.sql
-- PostgreSQL reset script for FlowDesk
-- DB from application.properties:
-- jdbc:postgresql://localhost:5434/FlowDesk

BEGIN;

-- Remove all data from every table in public schema and reset identity IDs.
DO $$
DECLARE
    table_list text;
BEGIN
    SELECT string_agg(format('%I.%I', schemaname, tablename), ', ')
    INTO table_list
    FROM pg_tables
    WHERE schemaname = 'public';

    IF table_list IS NOT NULL THEN
        EXECUTE 'TRUNCATE TABLE ' || table_list || ' RESTART IDENTITY CASCADE';
    END IF;
END $$;

-- Required roles
INSERT INTO roles (role_id, role)
VALUES
    (1, 'ROLE_CLIENT'),
    (2, 'ROLE_FREELANCER'),
    (3, 'ROLE_ADMIN');

-- Demo users from WebSecurityConfig
INSERT INTO users (
    user_id,
    first_name,
    last_name,
    user_email,
    user_password,
    user_phone_number,
    enabled,
    account_non_expired,
    account_non_locked,
    credentials_non_expired
)
VALUES
    (
        1,
        'user1',
        'user1',
        'user1@example.com',
        '$2a$10$KYwLl5JeTx2D.wmmSgaOoeo9y2Q3TXhUaNbstOzeW5TzBLmUu/Q0i',
        NULL,
        true,
        true,
        true,
        true
    ),
    (
        2,
        'freelancer1',
        'freelancer1',
        'freelancer@example.com',
        '$2a$10$5MetJbgiu/RUiGUlEKFLJuB/5MVRSNYKs7.ls0TgnjkfsIuqVmX/6',
        NULL,
        true,
        true,
        true,
        true
    ),
    (
        3,
        'admin',
        'admin',
        'admin@example.com',
        '$2a$10$99X3y2nijYjgUpQMMPAy2uwOQehk4mAk1cLtbuu2EcJERFHYdMKzS',
        NULL,
        true,
        true,
        true,
        true
    );

-- User role mappings
INSERT INTO user_roles (user_id, role_id)
VALUES
    (1, 1),
    (2, 2),
    (3, 1),
    (3, 2),
    (3, 3);

-- Keep sequences ahead of seeded IDs
SELECT setval(pg_get_serial_sequence('roles', 'role_id'), 3, true);
SELECT setval(pg_get_serial_sequence('users', 'user_id'), 3, true);

COMMIT;