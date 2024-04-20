import fs from "react-native-fs";
import { XMLParser } from "fast-xml-parser";

import type { LocalSaveGame } from "~/types/LocalSaveGame";
import { SaveDataValidator } from "./SaveDataValidator";

export class RNFSSavesCrawler {
  private readonly stardewValleyDir =
    fs.ExternalStorageDirectoryPath + "/StardewValley";

  async listLocalSaves(): Promise<LocalSaveGame[]> {
    const stardewValleyDirExists =
      (await fs.exists(this.stardewValleyDir)) &&
      (await fs.stat(this.stardewValleyDir)).isDirectory;

    if (!stardewValleyDirExists) {
      await fs.mkdir(this.stardewValleyDir);
    }

    const localSavePaths = await this.getLocalSavePaths();

    const localSaveGames = await Promise.all(
      localSavePaths.map(async (fullPath) => {
        const pathSplit = fullPath.split("/");
        const path = pathSplit.at(-1) ?? "";

        return this.readSaveGameData(path);
      }),
    );

    return localSaveGames;
  }

  async readSaveGameData(savePath: string): Promise<LocalSaveGame> {
    const saveGameInfoXML = await fs.readFile(
      this.stardewValleyDir + "/" + savePath + "/SaveGameInfo",
    );

    const parser = new XMLParser();

    const pathSplit = savePath.split("/");
    const saveDir = pathSplit.at(-1);

    const saveGameInfoJSON = parser.parse(saveGameInfoXML) as unknown;

    const saveGameInfo = SaveDataValidator.parse(saveGameInfoJSON);

    return {
      playerName: saveGameInfo.Farmer.name,
      uniqueMultiplayerId: saveGameInfo.Farmer.UniqueMultiplayerID,
      farmName: saveGameInfo.Farmer.farmName,
      money: saveGameInfo.Farmer.money,
      playtime: saveGameInfo.Farmer.saveTime,
      path: saveDir ?? "",
    };
  }

  private async getLocalSavePaths(): Promise<string[]> {
    const savesDirs = await fs.readDir(this.stardewValleyDir);

    const localSaveGamePaths = savesDirs
      .filter((dir) => dir.isDirectory)
      .map((dir) => dir.path);

    return localSaveGamePaths;
  }
}
