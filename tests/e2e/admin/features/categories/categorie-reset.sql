-- Reset categories and services tables
BEGIN;

TRUNCATE TABLE services, categories RESTART IDENTITY CASCADE;

COMMIT;
