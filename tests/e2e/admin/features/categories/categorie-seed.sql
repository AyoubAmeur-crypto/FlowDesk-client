-- Seed data for categories table
BEGIN;

INSERT INTO categories (category_id, category_name, last_edited)
VALUES
    (1, 'Web Development', '2026-06-17'),
    (2, 'Design & Creative', '2026-06-17'),
    (3, 'Marketing & Communication', '2026-06-17'),
    (4, 'Writing & Translation', '2026-06-17'),
    (5, 'Business Consulting', '2026-06-17'),
    (6, 'Data & Analytics', '2026-06-17'),
    (7, 'Video & Animation', '2026-06-17'),
    (8, 'AI Automation', '2026-06-17');

-- Set the sequence to the highest ID so database automatic ID generation works correctly
SELECT setval(pg_get_serial_sequence('categories', 'category_id'), 8, true);

COMMIT;
