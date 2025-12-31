import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres, { type Sql } from "postgres";
import * as schema from "./schema";

export type Database = PostgresJsDatabase<typeof schema>;

const databaseInstanceCache = new Map<string, Database>();
const clientInstanceCache = new Map<string, Sql>();

/**
 * Creates and memoizes a Drizzle database instance for a given connection string.
 * This ensures that a single Pool and Drizzle instance is reused for the same connection string,
 * preventing connection leaks and optimizing resource usage.
 *
 * @param connectionString The PostgreSQL connection string.
 * @returns A Drizzle database instance.
 */
export function createDatabase(connectionString: string): Database {
  if (databaseInstanceCache.has(connectionString)) {
    return databaseInstanceCache.get(connectionString)!;
  }

  let client = clientInstanceCache.get(connectionString);
  if (!client) {
    client = postgres(connectionString, {
      max: 10,
      idle_timeout: 30,
      connect_timeout: 10,
      ssl: "require",
    });

    clientInstanceCache.set(connectionString, client);
  }

  const db = drizzle(client, { schema });
  databaseInstanceCache.set(connectionString, db);

  return db;
}

/**
 * Gets the default database instance from `process.env.DATABASE_URL`.
 * This is convenient for environments where the URL is globally available
 * and you want a single, pre-configured instance.
 * It leverages `createDatabase` for memoization.
 * Throws an error if DATABASE_URL is not set.
 */
export function getDefaultDb(): Database {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set.");
  }
  return createDatabase(process.env.DATABASE_URL);
}

/**
 * Closes all cached database pools gracefully.
 * Essential for proper application shutdown in long-running processes (e.g., NestJS).
 */
export async function closeAllDatabaseConnections(): Promise<void> {
  console.log("Closing all postgres-js database connections...");

  for (const [connectionString, client] of clientInstanceCache.entries()) {
    try {
      await client.end({ timeout: 5 }); // seconds
      console.log(`Client for ${connectionString} closed.`);
    } catch (error) {
      console.error(`Error closing client for ${connectionString}:`, error);
    } finally {
      clientInstanceCache.delete(connectionString);
      databaseInstanceCache.delete(connectionString);
    }
  }

  console.log("All database connections processed.");
}
