import { drizzle } from "drizzle-orm/libsql";

import env from "@/env";

import * as schema from "./schema";

const sqlite = drizzle({
  connection: {
    url: "file:dev.db",
    authToken: env.DATABASE_AUTH_TOKEN,
  },
  casing: "snake_case",
  schema,
});

export default sqlite;
