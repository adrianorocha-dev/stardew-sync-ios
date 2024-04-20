import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BaseAppBackground } from "~/components/ui/BaseAppBackground";
import { Button } from "~/components/ui/Button";
import { api } from "~/utils/api";
import { useAuth } from "~/utils/auth";

export default function Profile() {
  const router = useRouter();

  const { signOut } = useAuth();

  const apiUtils = api.useUtils();
  const { data: user } = api.users.me.useQuery();
  // const { data: saveGames } = api.saveGames.list.useQuery();

  function handleGoBack() {
    router.back();
  }

  async function handleSignOut() {
    await signOut();
    apiUtils.invalidate();
  }

  return (
    <BaseAppBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-1 p-6">
          <View className="relative flex-row items-center justify-center">
            <Pressable
              className="absolute left-0 items-center justify-center rounded-full p-3 active:opacity-50"
              onPress={handleGoBack}
            >
              <Ionicons name="arrow-back" size={32} color="white" />
            </Pressable>

            <Text className="text-[28px] font-bold text-white">
              Your Account
            </Text>
          </View>

          <View className="flex-1 items-center justify-around">
            <View className="items-center">
              <Image
                className="h-36 w-36 rounded-full"
                source={{
                  uri: user?.avatarUrl,
                }}
              />

              <Text className="text-2xl font-bold text-white">
                {user?.name}
              </Text>

              <Text className="text-2xl font-bold text-white">
                {/* {saveGames?.length} Farm{(saveGames?.length ?? 0) > 1 && "s"} */}
              </Text>
            </View>

            {/* <View className="flex-row items-center">
            <Switch />

            <Text className="text-2xl font-medium text-white">
              Enable auto-sync
            </Text>
          </View> */}

            <View>
              <Button intent="danger" onPress={handleSignOut}>
                Sign out
              </Button>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </BaseAppBackground>
  );
}
