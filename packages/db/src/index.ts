import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres, { type Sql } from "postgres";
import * as schema from "./schema";

export type Database = PostgresJsDatabase<typeof schema>;

interface CachedInstance {
  client: Sql;
  db: Database;
}

const instanceCache = new Map<string, CachedInstance>();

/**
 * Creates and memoizes a Drizzle database instance for a given connection string.
 * This ensures that a single postgres client and Drizzle instance is reused for the same
 * connection string, preventing connection leaks and optimizing resource usage.
 *
 * @param connectionString The PostgreSQL connection string.
 * @returns A Drizzle database instance.
 */
export function createDatabase(connectionString: string): Database {
  const cached = instanceCache.get(connectionString);
  if (cached) {
    return cached.db;
  }

  const client = postgres(connectionString, {
    max: 10,
    idle_timeout: 30,
    connect_timeout: 10,
    ssl: "require",
  });

  const db = drizzle(client, { schema });
  instanceCache.set(connectionString, { client, db });

  return db;
}

/**
 * Backwards-compatible default `db` export.
 * Lazily creates a database instance from `process.env.DATABASE_URL` on first access.
 */
let defaultDb: Database | null = null;

export function getDb(): Database {
  if (defaultDb) return defaultDb;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL environment variable is not set. Cannot create default `db` instance.",
    );
  }

  defaultDb = createDatabase(connectionString);
  return defaultDb;
}

/**
 * Lazy-loaded default db instance - call getDb() to access
 */
export const db = new Proxy({} as Database, {
  get: (target, prop) => {
    const instance = getDb();
    return Reflect.get(instance, prop);
  },
});

/**
 * Closes all cached database pools gracefully.
 * Essential for proper application shutdown in long-running processes (e.g., NestJS).
 */
export async function closeAllDatabaseConnections(): Promise<void> {
  console.log("Closing all postgres-js database connections...");

  for (const [connectionString, { client }] of instanceCache.entries()) {
    try {
      await client.end({ timeout: 5 }); // seconds
      console.log(`Client for ${connectionString} closed.`);
    } catch (error) {
      console.error(`Error closing client for ${connectionString}:`, error);
    } finally {
      instanceCache.delete(connectionString);
    }
  }

  defaultDb = null;
  console.log("All database connections processed.");
}
