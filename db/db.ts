//
import { Database } from "@/db/schema";
import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";

import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

const dialect = new PostgresDialect({
  pool: new Pool({
    // connectionString: process.env.DATABASE_URL,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    // port: 5434,
    max: 10,
    ssl: true,
  }),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<Database>({
  dialect,
});
