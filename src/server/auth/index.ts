import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";

import { db } from "../db";
import { sessions, users } from "../db/schema";

const adapter = new DrizzleSQLiteAdapter(db, sessions, users);

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

export const getSessionToken = async (authHeader?: string | null) => {
  if (!authHeader) {
    return null;
  }

  const sessionId = lucia.readBearerToken(authHeader);

  if (!sessionId) {
    return null;
  }

  const { session } = await lucia.validateSession(sessionId);

  return session;
};
