import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const connectionString = process.env.DATABASE_URL;

const sslRequired =
  process.env.DATABASE_SSL === "true" ||
  process.env.PGSSLMODE === "require" ||
  /sslmode=require/i.test(connectionString) ||
  /ssl=true/i.test(connectionString);

export const pool = new Pool({
  connectionString,
  ssl: sslRequired ? { rejectUnauthorized: false } : undefined,
});
export const db = drizzle(pool, { schema });
