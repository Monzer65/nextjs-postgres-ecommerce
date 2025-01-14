import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable("user")
    .addColumn("id", sql`integer generated always as identity`, (col) =>
      col.primaryKey()
    )
    .addColumn("phone", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("phone_verified", "boolean", (col) =>
      col.notNull().defaultTo(false)
    )
    .addColumn("email", "varchar(255)", (col) => col.unique())
    .addColumn("email_verified", "boolean", (col) =>
      col.notNull().defaultTo(false)
    )
    .addColumn("username", "varchar(255)", (col) => col.unique())
    .addColumn("first_name", "varchar(255)")
    .addColumn("last_name", "varchar(255)")
    .addColumn("avatar", "text")
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .execute();

  await db.schema
    .createTable("user_session")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("user_id", "integer", (col) =>
      col.references("user.id").onDelete("cascade")
    )
    .addColumn("expires_at", "timestamp", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .execute();

  await db.schema
    .createTable("role")
    .addColumn("id", sql`integer generated always as identity`, (col) =>
      col.primaryKey()
    )
    .addColumn("name", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("description", "text")
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .execute();

  await db.schema
    .createTable("permission")
    .addColumn("id", sql`integer generated always as identity`, (col) =>
      col.primaryKey()
    )
    .addColumn("name", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("description", "text")
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .execute();

  await db.schema
    .createTable("role_permission")
    .addColumn("id", sql`integer generated always as identity`, (col) =>
      col.primaryKey()
    )
    .addColumn("role_id", "integer", (col) =>
      col.references("role.id").onDelete("cascade")
    )
    .addColumn("permission_id", "integer", (col) =>
      col.references("permission.id").onDelete("cascade")
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .execute();

  await db.schema
    .createTable("user_role")
    .addColumn("id", sql`integer generated always as identity`, (col) =>
      col.primaryKey()
    )
    .addColumn("user_id", "integer", (col) =>
      col.references("user.id").onDelete("cascade")
    )
    .addColumn("role_id", "integer", (col) =>
      col.references("role.id").onDelete("cascade")
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .execute();

  await db.schema
    .createTable("address")
    .addColumn("id", sql`integer generated always as identity`, (col) =>
      col.primaryKey()
    )
    .addColumn("user_id", "integer", (col) =>
      col.references("user.id").onDelete("cascade")
    )
    .addColumn("address_line_1", "text", (col) => col.notNull())
    .addColumn("address_line_2", "text")
    .addColumn("city", "text", (col) => col.notNull())
    .addColumn("state", "text", (col) => col.notNull())
    .addColumn("postal_code", "text", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .execute();

  await db.schema
    .createTable("brand")
    .addColumn("id", sql`integer generated always as identity`, (col) =>
      col.primaryKey()
    )
    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("description", "text")
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`NOW()`))
    .execute();

  await db.schema
    .createTable("manufacturer")
    .addColumn("id", sql`integer generated always as identity`, (col) =>
      col.primaryKey()
    )
    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("description", "text")
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`NOW()`))
    .execute();

  await db.schema
    .createTable("category")
    .addColumn("id", sql`integer generated always as identity`, (col) =>
      col.primaryKey()
    )
    .addColumn("name", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("description", "text")
    .addColumn("parent_id", "integer", (col) =>
      col.references("category.id").onDelete("set null")
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .execute();
  await db.schema
    .createTable("discount")
    .addColumn("id", sql`integer generated always as identity`, (col) =>
      col.primaryKey()
    )
    .addColumn("description", "text")
    .addColumn("discount_type", "text", (col) => col.notNull())
    .addColumn("discount_value", "numeric", (col) => col.notNull())
    .addColumn("active", "boolean", (col) => col.notNull())
    .addColumn("valid_from", "timestamp", (col) => col.notNull())
    .addColumn("valid_to", "timestamp")
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .execute();
  await db.schema
    .createTable("warranty")
    .addColumn("id", sql`integer generated always as identity`, (col) =>
      col.primaryKey()
    )
    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("description", "text")
    .addColumn("duration", "integer", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`NOW()`))
    .execute();

  await db.schema
    .createTable("product")
    .addColumn("id", sql`integer generated always as identity`, (col) =>
      col.primaryKey()
    )
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("price", "numeric", (col) => col.notNull())
    .addColumn("sku", "text", (col) => col.notNull().unique())
    .addColumn("stock", "integer", (col) => col.notNull())
    .addColumn("min_order_quantity", "integer")
    .addColumn("max_order_quantity", "integer")
    .addColumn("weight", "numeric")
    .addColumn("length", "numeric")
    .addColumn("width", "numeric")
    .addColumn("height", "numeric")
    .addColumn("brand_id", "integer", (col) => col.references("brand.id"))
    .addColumn("manufacturer_id", "integer", (col) =>
      col.references("manufacturer.id")
    )
    .addColumn("category_id", "integer", (col) => col.references("category.id"))
    .addColumn("discount_id", "integer", (col) => col.references("discount.id"))
    .addColumn("warranty_id", "integer", (col) => col.references("warranty.id"))
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`NOW()`))
    .addColumn("deleted_at", "timestamp")
    .execute();

  await db.schema
    .createIndex("idx_product_name")
    .on("product")
    .column("name")
    .execute();

  await db.schema
    .createTable("wishlist")
    .addColumn("id", sql`integer generated always as identity`, (col) =>
      col.primaryKey()
    )
    .addColumn("user_id", "integer", (col) =>
      col.references("user.id").onDelete("cascade")
    )
    .addColumn("product_id", "integer", (col) =>
      col.references("product.id").onDelete("cascade")
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .execute();

  await db.schema
    .createTable("variation")
    .addColumn("id", sql`integer generated always as identity`, (col) =>
      col.primaryKey()
    )
    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("value", "varchar(255)", (col) => col.notNull())
    .addColumn("price_modifier", "numeric")
    .addColumn("sku", "text", (col) => col.unique())
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`NOW()`))
    .execute();

  await db.schema
    .createTable("product_variation")
    .addColumn("product_id", "integer", (col) =>
      col.references("product.id").onDelete("cascade")
    )
    .addColumn("variation_id", "integer", (col) =>
      col.references("variation.id").onDelete("cascade")
    )
    .addColumn("quantity", "integer", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`NOW()`))
    .execute();

  await db.schema
    .createTable("product_image")
    .addColumn("id", sql`integer generated always as identity`, (col) =>
      col.primaryKey()
    )
    .addColumn("product_id", "integer", (col) =>
      col.references("product.id").onDelete("cascade")
    )
    .addColumn("url", "text", (col) => col.notNull())
    .addColumn("alt_text", "text")
    .addColumn("is_primary", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("order", "integer", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`NOW()`))
    .execute();

  await db.schema
    .createTable("tag")
    .addColumn("id", sql`integer generated always as identity`, (col) =>
      col.primaryKey()
    )
    .addColumn("name", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .execute();

  await db.schema
    .createTable("product_tag")
    .addColumn("id", sql`integer generated always as identity`, (col) =>
      col.primaryKey()
    )
    .addColumn("product_id", "integer", (col) =>
      col.references("product.id").onDelete("cascade")
    )
    .addColumn("tag_id", "integer", (col) =>
      col.references("tag.id").onDelete("cascade")
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .execute();

  await db.schema
    .createTable("product_review")
    .addColumn("id", sql`integer generated always as identity`, (col) =>
      col.primaryKey()
    )
    .addColumn("user_id", "integer", (col) => col.references("user.id"))
    .addColumn("product_id", "integer", (col) => col.references("product.id"))
    .addColumn("rating", "integer", (col) => col.notNull())
    .addColumn("title", "varchar(255)")
    .addColumn("comment", "text")
    .addColumn("user_images", sql`text[]`, (col) => col.notNull())
    .addColumn("review_status", "varchar(255)", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .execute();

  await db.schema
    .createTable("shopping_session")
    .addColumn("id", sql`integer generated always as identity`, (col) =>
      col.primaryKey()
    )
    .addColumn("user_id", "integer", (col) => col.references("user.id"))
    .addColumn("total_amount", "numeric", (col) => col.notNull())
    .addColumn("expires_at", "timestamp")
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`NOW()`))
    .execute();

  await db.schema
    .createTable("cart_item")
    .addColumn("id", sql`integer generated always as identity`, (col) =>
      col.primaryKey()
    )
    .addColumn("shopping_session_id", "integer", (col) =>
      col.references("shopping_session.id").onDelete("cascade")
    )
    .addColumn("product_id", "integer", (col) => col.references("product.id"))
    .addColumn("unit_price", "numeric", (col) => col.notNull())
    .addColumn("quantity", "integer", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .execute();

  await db.schema
    .createTable("order")
    .addColumn("id", sql`integer generated always as identity`, (col) =>
      col.primaryKey()
    )
    .addColumn("user_id", "integer", (col) => col.references("user.id"))
    .addColumn("total_amount", "integer", (col) => col.notNull())
    .addColumn("order_status", "text", (col) =>
      col.notNull().defaultTo("pending")
    )
    .addColumn("order_notes", "text")
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`NOW()`))
    .execute();

  await db.schema
    .createTable("order_item")
    .addColumn("id", sql`integer generated always as identity`, (col) =>
      col.primaryKey()
    )
    .addColumn("order_id", "integer", (col) => col.references("order.id"))
    .addColumn("product_id", "integer", (col) => col.references("product.id"))
    .addColumn("quantity", "integer", (col) => col.notNull())
    .addColumn("price", "integer", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`NOW()`))
    .execute();

  await db.schema
    .createTable("payment")
    .addColumn("id", sql`integer generated always as identity`, (col) =>
      col.primaryKey()
    )
    .addColumn("order_id", "integer", (col) => col.references("order.id"))
    .addColumn("transaction_id", "varchar(255)", (col) => col.notNull())
    .addColumn("amount", "integer", (col) => col.notNull())
    .addColumn("payment_method", "varchar(255)", (col) =>
      col.notNull().defaultTo("bank_transfer")
    )
    .addColumn("payment_status", "varchar(255)", (col) =>
      col.notNull().defaultTo("pending")
    )
    .addColumn("payment_date", "timestamp", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`NOW()`))
    .execute();

  await db.schema
    .createTable("shipping_address")
    .addColumn("id", sql`integer generated always as identity`, (col) =>
      col.primaryKey()
    )
    .addColumn("user_id", "integer", (col) => col.references("user.id"))
    .addColumn("address_line1", "text", (col) => col.notNull())
    .addColumn("address_line2", "text")
    .addColumn("city", "text", (col) => col.notNull())
    .addColumn("state", "text", (col) => col.notNull())
    .addColumn("zip", "text", (col) => col.notNull())
    .addColumn("phone", "text", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`NOW()`))
    .execute();

  await db.schema
    .createTable("shipping")
    .addColumn("id", sql`integer generated always as identity`, (col) =>
      col.primaryKey()
    )
    .addColumn("order_id", "integer", (col) => col.references("order.id"))
    .addColumn("shipping_method", "text", (col) =>
      col.notNull().defaultTo("standard")
    )
    .addColumn("shipping_provider", "text", (col) =>
      col.notNull().defaultTo("post")
    )
    .addColumn("shipping_address_id", "integer", (col) =>
      col.references("shipping_address.id")
    )
    .addColumn("shipping_status", "text", (col) =>
      col.notNull().defaultTo("pending")
    )
    .addColumn("tracking_number", "text", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`NOW()`))
    .execute();

  await db.schema
    .createTable("refund")
    .addColumn("id", sql`integer generated always as identity`, (col) =>
      col.primaryKey()
    )
    .addColumn("order_item_id", "integer", (col) =>
      col.references("order_item.id")
    )
    .addColumn("amount", "integer", (col) => col.notNull())
    .addColumn("reason", "text", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`NOW()`)
    )
    .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`NOW()`))
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable("user").execute();
  await db.schema.dropTable("user_session").execute();
  await db.schema.dropTable("role").execute();
  await db.schema.dropTable("permission").execute();
  await db.schema.dropTable("role_permission").execute();
  await db.schema.dropTable("user_role").execute();
  await db.schema.dropTable("address").execute();
  await db.schema.dropTable("wishlist").execute();
  await db.schema.dropTable("brand").execute();
  await db.schema.dropTable("manufacturer").execute();
  await db.schema.dropTable("category").execute();
  await db.schema.dropTable("discount").execute();
  await db.schema.dropTable("warranty").execute();
  await db.schema.dropTable("product").execute();
  await db.schema.dropTable("variation").execute();
  await db.schema.dropTable("product_variation").execute();
  await db.schema.dropTable("product_image").execute();
  await db.schema.dropTable("tag").execute();
  await db.schema.dropTable("product_tag").execute();
  await db.schema.dropTable("product_review").execute();
  await db.schema.dropTable("shopping_session").execute();
  await db.schema.dropTable("cart_item").execute();
  await db.schema.dropTable("order").execute();
  await db.schema.dropTable("order_item").execute();
  await db.schema.dropTable("payment").execute();
  await db.schema.dropTable("shipping_address").execute();
  await db.schema.dropTable("shipping").execute();
  await db.schema.dropTable("refund").execute();
}
