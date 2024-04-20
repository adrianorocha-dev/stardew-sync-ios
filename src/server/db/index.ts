import { createClient } from "@libsql/client/web";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";

export const libSQLClient = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN!,
});

export const db = drizzle(libSQLClient, { schema });
