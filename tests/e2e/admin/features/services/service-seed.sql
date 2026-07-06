-- Seed data for service feature tests.
-- Services depend on categories through services.category_id.
-- Hibernate also creates categories_services from Category.services.

INSERT INTO categories (category_id, category_name, last_edited)
VALUES
    (1, 'Web Development', '2026-06-17'),
    (2, 'Design & Creative', '2026-06-17'),
    (3, 'Marketing & Communication', '2026-06-17'),
    (4, 'Writing & Translation', '2026-06-17');

INSERT INTO services (service_id, service_name, service_description, image_url, service_price, category_id)
VALUES
    (1, 'frontend Development', 'React, Vue, and modern frontend application development.', 'https://images.unsplash.com/photo-1547082299-de196ea013d6', 49.99, 1),
    (2, 'Backend Development', 'Spring Boot, Node.js, and database design.', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c', 59.99, 1),
    (3, 'UI/UX Design', 'Figma mockups, wireframes, and user experience flow design.', 'https://images.unsplash.com/photo-1561070791-26c113006238', 39.99, 2),
    (4, 'SEO Optimization', 'Improve your search engine ranking and drive organic traffic.', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==', 29.99, 3),
    (5, 'Mobile App Development', 'Flutter and React Native development.', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==', 79.99, 1),
    (6, 'Logo Design', 'Professional logo and brand identity design.', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==', 19.99, 2),
    (7, 'Social Media Marketing', 'Manage and grow your social media presence.', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==', 34.99, 3),
    (8, 'Technical Writing', 'Write clean documentation and blog posts.', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==', 24.99, 4),
    (9, 'Translation Services', 'Translate content between English, French, and Spanish.', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==', 14.99, 4);

INSERT INTO categories_services (categories_category_id, services_service_id)
VALUES
    (1, 1),
    (1, 2),
    (2, 3),
    (3, 4),
    (1, 5),
    (2, 6),
    (3, 7),
    (4, 8),
    (4, 9);

-- Set the sequence to the highest ID so database automatic ID generation works correctly
SELECT setval(pg_get_serial_sequence('categories', 'category_id'), 4, true);
SELECT setval(pg_get_serial_sequence('services', 'service_id'), 9, true);
