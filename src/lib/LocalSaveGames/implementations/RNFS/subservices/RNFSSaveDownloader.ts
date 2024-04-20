import fs from "react-native-fs";

import type { SaveGame } from "~/types/SaveGame";

export class RNFSSaveDownloader {
  async downloadSave(save: SaveGame) {
    if (!save.downloadLink) {
      throw new Error("This save does not have a valid download link.");
    }

    const tmpDir = await this.getOrCreateTmpDir();

    await fs.downloadFile({
      fromUrl: save.downloadLink,
      toFile: `${tmpDir}/${String(save.uniqueMultiplayerId)}.zip`,
    }).promise;
  }

  private async getOrCreateTmpDir() {
    const tmpDir = fs.TemporaryDirectoryPath + "/StardewSync";

    if (!(await fs.exists(tmpDir)) || !(await fs.stat(tmpDir)).isDirectory) {
      await fs.mkdir(tmpDir);
    }

    return tmpDir;
  }
}
