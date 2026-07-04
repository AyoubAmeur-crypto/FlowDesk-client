import * as fs from 'fs';
import * as path from 'path';
import { Pool } from 'pg';

import dotenv from 'dotenv';

// Ensure env variables from .env.test.local are loaded
dotenv.config({ path: path.resolve(process.cwd(), '.env.test.local') });

const dbConfig = {
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASS || '0000',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5434', 10),
  database: process.env.DB_NAME || 'FlowDesk',
};

// Create a connection pool for general query usage
export const dbPool = new Pool(dbConfig);

/**
 * Execute all SQL queries inside a file.
 * Handles multi-statement SQL files correctly.
 * This is used primarily by global-setup.ts to execute the reset-db.sql script.
 */
export async function executeSqlFile(filePath: string): Promise<void> {
  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`SQL file not found at path: ${absolutePath}`);
  }

  const sqlContent = fs.readFileSync(absolutePath, 'utf-8');
  const client = await dbPool.connect();
  try {
    // Start transaction to run the file safely
    await client.query('BEGIN');
    await client.query(sqlContent);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`Failed to execute SQL file: ${absolutePath}`);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Convenience helper to reset and seed the database using specific file paths.
 * If paths are not provided, it looks for standard locations under the tests directory.
 */
export async function resetAndSeedDatabase(options?: {
  resetSqlPath?: string;
  seedSqlPath?: string;
}): Promise<void> {
  const defaultResetPath = path.join(process.cwd(), 'tests', 'e2e', 'fixtures', 'reset.sql');
  const defaultSeedPath = path.join(process.cwd(), 'tests', 'e2e', 'fixtures', 'seed.sql');

  const resetPath = options?.resetSqlPath || defaultResetPath;
  const seedPath = options?.seedSqlPath || defaultSeedPath;

  console.log(`[Database Setup] Running reset script: ${path.basename(resetPath)}`);
  await executeSqlFile(resetPath);

  console.log(`[Database Setup] Running seed script: ${path.basename(seedPath)}`);
  await executeSqlFile(seedPath);

  console.log('[Database Setup] Database has been successfully reset and seeded!');
}

/**
 * Clean up the database connection pool.
 * Useful to call in afterAll/globalTeardown hooks.
 */
export async function closeDatabaseConnection(): Promise<void> {
  await dbPool.end();
}
