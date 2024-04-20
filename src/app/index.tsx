import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BaseAppBackground } from "~/components/ui/BaseAppBackground";
import { useAuth } from "~/utils/auth";

export default function Index() {
  const router = useRouter();

  const { data: isOnboardingComplete, isLoading: isOnboardingLoading } =
    useQuery({
      queryKey: ["is-onboarding-complete"],
      queryFn: async () => {
        const isOnboardingComplete = await AsyncStorage.getItem(
          "@IsOnboardingComplete",
        );

        return isOnboardingComplete === "true";
      },
    });

  const { isLoading: authIsLoading, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isOnboardingLoading && !isOnboardingComplete) {
      router.replace("/onboarding/step1");
    }
  }, [isOnboardingLoading, isOnboardingComplete, router]);

  useEffect(() => {
    if (isOnboardingLoading) {
      return;
    }

    if (!authIsLoading && isSignedIn) {
      return router.replace("/profile");
    }

    if (!authIsLoading && !isSignedIn) {
      return router.replace("/sign-in");
    }
  }, [authIsLoading, isOnboardingLoading, isSignedIn, router]);

  if (authIsLoading || isOnboardingLoading) {
    return null;
  }

  return (
    <BaseAppBackground>
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#FFF" />
      </SafeAreaView>
    </BaseAppBackground>
  );
}
