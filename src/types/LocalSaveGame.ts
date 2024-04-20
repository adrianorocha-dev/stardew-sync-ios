import type { RouterOutputs } from "~/utils/api";

export type SaveGame = RouterOutputs["saveGames"]["list"][number];

export type LocalSaveGame = Omit<
  SaveGame,
  | "id"
  | "downloadLink"
  | "syncEnabled"
  | "userId"
  | "fileKey"
  | "createdAt"
  | "updatedAt"
>;
