import React from "react";
import { Image, Switch, Text, View } from "react-native";

import exampleCharImg from "~/assets/example-char.png";
import stardewClockImg from "~/assets/stardew-clock.png";
import stardewCoinImg from "~/assets/stardew-coin.png";

// type SaveGame = RouterOutputs["saveGames"]["list"][number];

interface SaveGameProps {
  saveGame: any; //SaveGame;
  onEnabledChange: (enabled: boolean) => void;
}

export function SaveGameCard({ saveGame, onEnabledChange }: SaveGameProps) {
  return (
    <View className="mb-3 w-full flex-row items-center justify-between rounded-xl border-2 border-white bg-[#ffffff60] px-3 py-1">
      <View className="justify-center">
        <View className="rounded-lg border-2 border-white">
          <Image source={exampleCharImg} className="h-14 w-14 rounded-lg" />
        </View>

        <Text
          className="my-1 text-center text-xs font-semibold text-white"
          numberOfLines={1}
        >
          {saveGame.playerName}
        </Text>
      </View>

      <View className="justify-center">
        <View className="flex-row items-center">
          <Text className="text-sm font-medium text-white" numberOfLines={1}>
            {saveGame.farmName}
          </Text>
        </View>

        <View className="my-1 flex-row items-center">
          <Image source={stardewCoinImg} className="mr-1 h-4 w-4" />
          <Text className="text-sm font-medium text-white">
            {String(saveGame.money)}
          </Text>
        </View>

        <View className="my-1 flex-row items-center">
          <Image source={stardewClockImg} className="mr-1 h-4 w-4" />
          <Text className="text-sm font-medium text-white">
            {formatMsToMinutes(saveGame.playtime)}
          </Text>
        </View>
      </View>

      <View>
        <Switch
          trackColor={{ true: "#D9D9D9", false: "#D9D9D9" }}
          thumbColor={saveGame.syncEnabled ? "#0040A0" : "gray"}
          value={saveGame.syncEnabled}
          onValueChange={onEnabledChange}
        />
      </View>
    </View>
  );
}

function formatMsToMinutes(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);

  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
