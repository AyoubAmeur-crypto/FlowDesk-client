-- Reset service feature data.
-- Keep this scoped to category/service tables used by the service screens.

TRUNCATE TABLE categories_services, services, categories RESTART IDENTITY CASCADE;
