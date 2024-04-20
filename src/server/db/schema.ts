import { createId } from "@paralleldrive/cuid2";
import { InferSelectModel, sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url").notNull(),

  discordId: text("discord_id").notNull(),

  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type User = Pick<
  InferSelectModel<typeof users>,
  "id" | "name" | "avatarUrl"
>;

export const sessions = sqliteTable("session", {
  id: text("id").primaryKey().notNull(),
  expiresAt: integer("expires_at").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
});
