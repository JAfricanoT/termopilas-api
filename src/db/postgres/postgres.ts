import { drizzle } from "drizzle-orm/node-postgres";

import env from "@/env";

import * as schema from "./schemas/users/schema";

const postgres = drizzle({
  connection: {
    connectionString: env.DATABASE_URL,
    ssl: false,
  },
  casing: "snake_case",
  schema,
});

async function logDatabaseTime() {
  try {
    const result = await postgres.execute("SELECT NOW() as current_time");
    console.log("DB Current Time:", result.rows[0].current_time);
  }
  catch (error) {
    console.error("Error:", error);
  }
}

// Autoejecutar la función al inicializar el módulo
logDatabaseTime();

export default postgres;
