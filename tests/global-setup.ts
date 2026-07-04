import { execSync } from 'child_process';
import * as path from 'path';
import { executeSqlFile, closeDatabaseConnection } from './e2e/fixtures/db';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.test.local') });

const COMPOSE_FILE = 'docker-compose.e2e.yml';

function runCommand(cmd: string, opts: { allowFailure?: boolean } = {}) {
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (error) {
    if (!opts.allowFailure) {
      throw error;
    }
  }
}

async function resetDb() {
  const host = process.env.DB_HOST ?? 'localhost';
  const port = process.env.DB_PORT ?? '5434';
  const db = process.env.DB_NAME ?? 'FlowDesk';
  
  console.log(`[e2e] Resetting database data: ${db} on ${host}:${port}...`);
  try {
    const sqlPath = path.resolve(process.cwd(), 'tests/reset-db.sql');
    await executeSqlFile(sqlPath);
    console.log(`[e2e] Database successfully reset using: ${sqlPath}`);
  } catch (error) {
    console.error('[e2e] Database reset failed!');
    throw error;
  }
}

export default async function globalSetup() {
  // 1. E2E Local Mode (Skip Docker entirely)
  if (process.env.E2E_LOCAL === 'true') {
    console.log('\n[e2e] LOCAL mode — skipping Docker setup.');
    await resetDb();
    // Close pool connections in global-setup so tests can open their own cleanly
    await closeDatabaseConnection();
    console.log('\n[e2e] Database reset completed. Starting tests...\n');
    return;
  }

  // 2. Docker Mode (Verify Docker is running)
  try {
    execSync('docker info', { stdio: 'pipe' });
  } catch {
    throw new Error(
      'Docker is not running. Please start Docker Desktop or ensure the docker daemon is active, then try again.'
    );
  }

  // 3. CI vs Local Docker setup
  if (process.env.CI) {
    console.log('\n[e2e] CI mode — building images and starting services...');
    // Build the Spring Boot container locally in GitHub Actions before running tests
    runCommand(`docker compose -f ${COMPOSE_FILE} up -d --build --wait`);
  } else {
    console.log('\n[e2e] Docker mode — starting services...');
    // In local dev, we assume the backend container image is already available or running
    runCommand(`docker compose -f ${COMPOSE_FILE} up -d --wait`);
  }

  // 4. Reset DB after services are up
  await resetDb();
  await closeDatabaseConnection();
  console.log('\n[e2e] Infrastructure is ready and seeded. Running tests...\n');
}
