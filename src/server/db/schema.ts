import { createId } from "@paralleldrive/cuid2";
import { InferSelectModel, relations, sql } from "drizzle-orm";
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

export const userRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  saveGames: many(saveGames),
}));

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

export const saveGames = sqliteTable("save_game", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  uniqueMultiplayerId: text("unique_multiplayer_id")
    .unique("save_game_unique_multiplayer_id_key")
    .notNull(),
  playerName: text("player_name").notNull(),
  farmName: text("farm_name").notNull(),
  money: integer("money").notNull(),
  playtime: integer("playtime").notNull(),
  path: text("path").notNull(),
  downloadLink: text("download_link"),
  fileKey: text("file_key"),
  syncEnabled: integer("sync_enabled", { mode: "boolean" })
    .default(false)
    .notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),

  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdateFn(
    () => new Date(),
  ),
});

export const saveGameRelations = relations(saveGames, ({ one }) => ({
  user: one(users, {
    fields: [saveGames.userId],
    references: [users.id],
  }),
}));
