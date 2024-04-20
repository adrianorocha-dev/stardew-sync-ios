import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import logoImg from "~/assets/stardew-sync-logo.png";
import { BaseAppBackground } from "~/components/ui/BaseAppBackground";
import { Button } from "~/components/ui/Button";
import { useAuth } from "~/utils/auth";

export default function LoginPage() {
  const { signInWithOAuth } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleSignInWithDiscord = useCallback(() => {
    console.log("Sign in with Discord");
    setIsLoading(true);
    signInWithOAuth("discord")
      .then(() => {
        console.log("Signed in with Discord");
        router.replace("/profile");
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Error", error?.message ?? "Something went wrong");
        setIsLoading(false);
      });
  }, []);

  return (
    <BaseAppBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-1 items-center justify-center">
          <Image source={logoImg} />

          <Button
            className="my-2 bg-indigo-700"
            onPress={handleSignInWithDiscord}
            startIcon={<Ionicons name="logo-discord" size={24} color="white" />}
            loading={isLoading}
          >
            Sign in with Discord
          </Button>
        </View>
      </SafeAreaView>
    </BaseAppBackground>
  );
}
