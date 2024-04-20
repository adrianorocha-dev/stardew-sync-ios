import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { BaseAppBackground } from "~/components/ui/BaseAppBackground";
import { useAuth } from "~/utils/auth";

export default function AppLayout() {
  const { isSignedIn, isLoading } = useAuth();

  console.log("authed layout", { isSignedIn, isLoading });

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return (
      <BaseAppBackground>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="white" size="large" />
        </View>
      </BaseAppBackground>
    );
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!isSignedIn) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/sign-in" />;
  }

  // This layout can be deferred because it's not the root layout.
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="saves" />
  );
}
