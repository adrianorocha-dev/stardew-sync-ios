import { FlashList } from "@shopify/flash-list";
import { Link } from "expo-router";
import { useState } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SaveGameCard } from "~/components/SaveGameCard";
import { BaseAppBackground } from "~/components/ui/BaseAppBackground";
import { Button } from "~/components/ui/Button";
// import { localSaveGamesService } from "~/lib/LocalSaveGames";
import { api } from "~/utils/api";
// import { betterPromiseSettle } from "~/utils/betterPromiseSettle";
// import {
//   compareLocalToCloudSave,
//   SaveSyncStatus,
// } from "~/utils/compareLocalToCloudSave";
// import { uploadFileToS3 } from "~/utils/uploadFileToS3";

export default function SaveGamesList() {
  const { data: user } = api.users.me.useQuery();

  const {
    data: saveGames,
    refetch,
    isRefetching,
    isLoading,
  } = api.saveGames.list.useQuery();

  const createSaveGameMutation = api.saveGames.create.useMutation({
    onSettled() {
      refetch();
    },
  });

  const [isUploadingSaves, setIsUploadingSaves] = useState(false);

  const uploadSaveGameDataMutation = api.saveGames.upload.useMutation({
    onSettled() {
      refetch();
    },
  });

  const apiUtils = api.useUtils();

  const mutateSaveSyncToggle = api.saveGames.toggleSync.useMutation({
    onMutate: async ({ id, enabled }) => {
      await apiUtils.saveGames.list.cancel();
      const previousSavesList = apiUtils.saveGames.list.getData();
      apiUtils.saveGames.list.setData(
        undefined,
        (old) =>
          old?.map((item) =>
            item.id === id ? { ...item, syncEnabled: enabled } : item,
          ) ?? [],
      );

      return { previousSavesList };
    },
    onError: (error, input, context) => {
      console.error(error);
      apiUtils.saveGames.list.setData(
        undefined,
        context?.previousSavesList ?? [],
      );
    },
  });

  const [isSyncing, setIsSyncing] = useState(false);

  const selectedSaves = saveGames?.filter((save) => save.syncEnabled) ?? [];

  async function fetchLocalSaves() {
    // const localSaveGames = await localSaveGamesService.listLocalSaves();
    // const savesNotSynced = localSaveGames.filter((localSave) =>
    //   saveGames?.every(
    //     (save) => localSave.uniqueMultiplayerId !== save.uniqueMultiplayerId,
    //   ),
    // );
    // for (const localSave of savesNotSynced) {
    //   createSaveGameMutation.mutate(localSave);
    // }
  }

  function handleRefreshSavesList() {
    fetchLocalSaves();
    refetch({ cancelRefetch: true });
  }

  async function calculateSavesSyncStatus() {
    // if (!selectedSaves?.length) {
    return [];
    // }

    // const savesSyncStatus = await Promise.all(
    //   selectedSaves.map(async (save) => {
    //     const localSave = await localSaveGamesService.readLocalSave(save);

    //     const status = compareLocalToCloudSave(localSave, save);

    //     return status;
    //   }),
    // );

    // return savesSyncStatus;
  }

  async function handleSyncSaves() {
    try {
      setIsSyncing(true);

      const savesSyncStatus = await calculateSavesSyncStatus();

      setIsUploadingSaves(true);

      // const results = await betterPromiseSettle(
      //   savesSyncStatus.map(async (result) => {
      //     if (result.status === SaveSyncStatus.SYNCED) {
      //       return;
      //     }

      //     if (result.status === SaveSyncStatus.LOCAL_NEWER) {
      //       const zipPath = await localSaveGamesService.zipAndReadSave(
      //         result.cloudSave,
      //       );

      //       const { presignedPost } =
      //         await uploadSaveGameDataMutation.mutateAsync({
      //           id: result.cloudSave.id,
      //           money: result.localSave.money,
      //           playtime: result.localSave.playtime,
      //         });

      //       await uploadFileToS3(
      //         {
      //           uri: "file://" + zipPath,
      //           name: zipPath.split("/").at(-1) ?? "",
      //           type: "application/zip",
      //         },
      //         presignedPost,
      //       );
      //     }

      //     if (result.status === SaveSyncStatus.CLOUD_NEWER) {
      //       await localSaveGamesService.downloadAndUnzipSave(result.cloudSave);
      //     }
      //   }),
      // );

      setIsUploadingSaves(false);

      // if (results.rejected.length > 0) {
      //   console.log("Rejected sync promises: ", results.rejected);
      //   Alert.alert("Error", "One or more save games failed to sync.");
      // }
    } catch (error: unknown) {
      console.error(error);
      Alert.alert("Error", "There was an error while syncing save games.");
    }

    setIsSyncing(false);
  }

  function handleToggleSaveSync(saveId: string) {
    return (enabled: boolean) => {
      mutateSaveSyncToggle.mutate({ id: saveId, enabled });
    };
  }

  console.log("saveGames: ", saveGames);

  return (
    <BaseAppBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-1 p-6">
          <View className="flex-row items-center justify-between">
            <Text className="text-[28px] font-bold text-white">Your Saves</Text>

            <Link href="/profile" asChild>
              <Pressable className="rounded-full active:opacity-50">
                <Image
                  source={{
                    uri: user?.avatarUrl ?? undefined,
                  }}
                  className="h-16 w-16 rounded-full"
                />
              </Pressable>
            </Link>
          </View>

          <View className="my-3 flex-1">
            <FlashList
              data={saveGames}
              keyExtractor={(saveGame) => String(saveGame.id)}
              estimatedItemSize={96}
              renderItem={({ item }) => (
                <SaveGameCard
                  saveGame={item}
                  onEnabledChange={handleToggleSaveSync(item.id)}
                />
              )}
              onRefresh={handleRefreshSavesList}
              refreshing={isLoading || isRefetching}
              ListEmptyComponent={() =>
                !isLoading && (
                  <Text className="rounded bg-red-600 p-2 text-center text-base text-white">
                    ⚠️ No save games found.
                  </Text>
                )
              }
            />
          </View>

          <View className="flex-row justify-center">
            <Button
              loading={isSyncing || isUploadingSaves}
              onPress={handleSyncSaves}
            >
              Sync now
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </BaseAppBackground>
  );
}
