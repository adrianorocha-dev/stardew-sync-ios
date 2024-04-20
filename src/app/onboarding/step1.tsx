import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import starsImg from "~/assets/Stars.png";
import { Button } from "~/components/ui/Button";
import { theme } from "~/utils/theme";

export default function OnboardingStep1() {
  console.log("onboarding");
  return (
    <>
      <StatusBar style="light" translucent />

      <LinearGradient
        className="flex-1"
        colors={[theme.colors.gradient[900], theme.colors.gradient[100]]}
      >
        <ImageBackground
          className="flex-1"
          imageStyle={{ opacity: 0.5 }}
          source={starsImg}
          resizeMode="repeat"
        >
          <SafeAreaView style={{ flex: 1 }}>
            <View className="flex-1 items-center justify-center">
              <View className="w-[90%] flex-col rounded-xl border-2 border-white bg-white/60 p-4">
                <Text className="text-center text-2xl font-bold">
                  Welcome to Stardew Sync
                </Text>

                <Link href="/profile" asChild>
                  <Button className="mt-6">Continue</Button>
                </Link>
              </View>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </LinearGradient>
    </>
  );
}
