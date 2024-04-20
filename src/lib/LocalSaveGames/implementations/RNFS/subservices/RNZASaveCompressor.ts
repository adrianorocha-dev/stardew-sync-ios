import fs from "react-native-fs";
import { unzip, zip } from "react-native-zip-archive";

import type { SaveGame } from "~/types/SaveGame";

export class RNZASaveCompressor {
  async compressSave(save: SaveGame) {
    const stardewValleyDir = fs.ExternalStorageDirectoryPath + "/StardewValley";
    const tmpDir = await this.getOrCreateTmpDir();

    const fullSavePath = stardewValleyDir + "/" + String(save.path);

    const compressedPath = await zip(
      fullSavePath,
      `${tmpDir}/${String(save.uniqueMultiplayerId)}.zip`,
    );

    return compressedPath;
  }

  async uncompressSave(save: SaveGame) {
    const stardewValleyDir = fs.ExternalStorageDirectoryPath + "/StardewValley";
    const tmpDir = await this.getOrCreateTmpDir();

    const zipFilePath = `${tmpDir}/${String(save.uniqueMultiplayerId)}.zip`;

    const saveZipExists = await fs.exists(zipFilePath);

    if (!saveZipExists) {
      throw new Error("There is no compressed file for the selected save.");
    }

    const fullSavePath = stardewValleyDir + "/" + String(save.path);

    if (await fs.exists(fullSavePath)) {
      await fs.unlink(fullSavePath);
      await fs.mkdir(fullSavePath);
    }

    const uncompressedPath = await unzip(zipFilePath, fullSavePath);

    await fs.unlink(zipFilePath);

    return uncompressedPath;
  }

  private async getOrCreateTmpDir() {
    const tmpDir = fs.TemporaryDirectoryPath + "/StardewSync";

    if (!(await fs.exists(tmpDir)) || !(await fs.stat(tmpDir)).isDirectory) {
      await fs.mkdir(tmpDir);
    }

    return tmpDir;
  }
}
