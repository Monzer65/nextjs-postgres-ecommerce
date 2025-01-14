import { defineConfig } from "kysely-ctl";
import { db } from "../db/db";
export default defineConfig({
  // replace me with a real dialect instance OR a dialect name + `dialectConfig` prop.
  kysely: db,
  migrations: {
    migrationFolder: "/db/migrations",
  },
  //   plugins: [],
  //   seeds: {
  //     seedFolder: "seeds",
  //   }
});
