import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("otp_verification_request")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("user_id", "integer", (col) => col.references("user.id"))
    .addColumn("phone_number", "text", (col) => col.notNull())
    .addColumn("otp", "text", (col) => col.notNull())
    .addColumn("expires_at", "timestamp", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("otp_verification_request").execute();
}
