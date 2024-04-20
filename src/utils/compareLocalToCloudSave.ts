import type { LocalSaveGame, SaveGame } from "~/types/LocalSaveGame";

export const SaveSyncStatus = {
  SYNCED: "SYNCED",
  CLOUD_NEWER: "CLOUD_NEWER",
  LOCAL_NEWER: "LOCAL_NEWER",
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SaveSyncStatus = keyof typeof SaveSyncStatus;

export function compareLocalToCloudSave(
  localSave: LocalSaveGame | undefined,
  cloudSave: SaveGame,
) {
  if (!localSave) {
    return {
      localSave,
      cloudSave,
      status: SaveSyncStatus.CLOUD_NEWER,
    };
  }

  if (localSave.uniqueMultiplayerId !== cloudSave.uniqueMultiplayerId) {
    throw new Error("Different save games cant be compared");
  }

  if (!cloudSave.downloadLink || localSave.playtime > cloudSave.playtime) {
    return {
      localSave,
      cloudSave,
      status: SaveSyncStatus.LOCAL_NEWER,
    };
  }

  if (localSave.playtime < cloudSave.playtime) {
    return {
      localSave,
      cloudSave,
      status: SaveSyncStatus.CLOUD_NEWER,
    };
  }

  if (localSave.playtime === cloudSave.playtime) {
    return {
      localSave,
      cloudSave,
      status: SaveSyncStatus.SYNCED,
    };
  }

  throw new Error("Unknown error while comparing saves");
}
