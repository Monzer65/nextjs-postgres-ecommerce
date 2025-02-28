import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	// up migration code goes here...
	// note: up migrations are mandatory. you must implement this function.
	// For more info, see: https://kysely.dev/docs/migrations
	await db.schema
		.alterTable("product")
		.addColumn("thumbnail", "text")
		.execute();
}
