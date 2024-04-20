import { Alert } from "react-native";
import * as IntentLauncher from "expo-intent-launcher";

import type { LocalSaveGame } from "~/types/LocalSaveGame";
import type { SaveGame } from "~/types/SaveGame";
import type { ILocalSaveGamesService } from "../../ILocalSaveGamesService";
import { RNFSSaveDownloader } from "./subservices/RNFSSaveDownloader";
import { RNFSSavesCrawler } from "./subservices/RNFSSavesCrawler";
import { RNZASaveCompressor } from "./subservices/RNZASaveCompressor";

export class RNFSSaveGamesService implements ILocalSaveGamesService {
  private readonly savesCrawler: RNFSSavesCrawler;
  private readonly saveCompressor: RNZASaveCompressor;
  private readonly saveDownloader: RNFSSaveDownloader;

  constructor() {
    this.savesCrawler = new RNFSSavesCrawler();
    this.saveCompressor = new RNZASaveCompressor();
    this.saveDownloader = new RNFSSaveDownloader();
  }

  async listLocalSaves(): Promise<LocalSaveGame[]> {
    try {
      const localSaves = await this.savesCrawler.listLocalSaves();

      return localSaves;
    } catch (err: unknown) {
      console.error("Error while listing local saves:", err);

      if (
        err &&
        typeof err === "object" &&
        "message" in err &&
        err.message &&
        typeof err.message === "string"
      ) {
        Alert.alert(
          "Error",
          "This app needs file access in order to sync your saves.\nPlease go to your settings and enable all files access for Stardew Sync",
          [
            {
              text: "OK",
              onPress: () => {
                void IntentLauncher.startActivityAsync(
                  "android.settings.MANAGE_ALL_FILES_ACCESS_PERMISSION",
                );
              },
            },
          ],
        );
      }
    }

    return [];
  }

  async readLocalSave(save: SaveGame): Promise<LocalSaveGame | undefined> {
    try {
      const localSaveData = await this.savesCrawler.readSaveGameData(save.path);

      return localSaveData;
    } catch (error: unknown) {
      console.error(error);
      return undefined;
    }
  }

  async zipAndReadSave(save: SaveGame): Promise<string> {
    const zipPath = await this.saveCompressor.compressSave(save);

    return zipPath;
  }

  async downloadAndUnzipSave(save: SaveGame) {
    await this.saveDownloader.downloadSave(save);

    const path = await this.saveCompressor.uncompressSave(save);

    return path;
  }
}
