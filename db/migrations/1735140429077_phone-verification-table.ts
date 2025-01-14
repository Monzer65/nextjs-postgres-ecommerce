import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("phone_verification_request")
    .ifNotExists()
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("user_id", "integer", (col) => col.references("user.id"))
    .addColumn("verification_code", "text", (col) => col.notNull())
    .addColumn("phone_number", "text", (col) => col.notNull())
    .addColumn("expires_at", "timestamp", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("phone_verification_request").execute();
}
