import { LibSQLAdapter } from "@lucia-auth/adapter-sqlite";
import { Lucia } from "lucia";

import { libSQLClient } from "../db";

const adapter = new LibSQLAdapter(libSQLClient, {
  user: "user",
  session: "session",
});

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
});

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
  }
}

export type Provider = "discord";
