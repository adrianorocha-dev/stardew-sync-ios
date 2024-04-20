import type { LocalSaveGame, SaveGame } from "~/types/LocalSaveGame";

export interface ILocalSaveGamesService {
  listLocalSaves(): Promise<LocalSaveGame[]>;
  zipAndReadSave(save: SaveGame): Promise<string>;
}
