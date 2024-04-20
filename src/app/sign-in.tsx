import { useCallback } from "react";
import { Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "~/utils/auth";

export default function LoginPage() {
  const { signInWithOAuth } = useAuth();

  const handleSignInWithDiscord = useCallback(() => {
    console.log("Sign in with Discord");
    signInWithOAuth("discord")
      .then(() => console.log("Logged in with Discord"))
      .catch((error) => console.error(error));
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom", "left", "right"]}>
      <View className="flex-1 items-center justify-center">
        <Text>Login</Text>
        <Button
          title="Sign in with Discord"
          onPress={handleSignInWithDiscord}
        />
      </View>
    </SafeAreaView>
  );
}
