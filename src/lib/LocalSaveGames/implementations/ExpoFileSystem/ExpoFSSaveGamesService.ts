import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

import type { ILocalSaveGamesService } from "../../ILocalSaveGamesService";

import type { LocalSaveGame, SaveGame } from "~/types/LocalSaveGame";

export class ExpoFSSaveGamesService implements ILocalSaveGamesService {
  async listLocalSaves() {
    const result = await DocumentPicker.getDocumentAsync({
      selectFolders: true,
    });
    console.log(JSON.stringify(result, null, 2));
    // FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    return [] as LocalSaveGame[];
  }

  async zipAndReadSave(save: SaveGame) {
    throw new Error("Method not implemented.");
    return "";
  }
}
