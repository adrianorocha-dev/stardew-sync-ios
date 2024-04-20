import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import type { ReactNode } from "react";
import { ImageBackground } from "react-native";

import starsImg from "~/assets/Stars.png";
import { theme } from "~/utils/theme";

interface BaseAppBackgroundProps {
  children: ReactNode;
}

export const BaseAppBackground = ({ children }: BaseAppBackgroundProps) => {
  return (
    <>
      <StatusBar style="light" translucent />

      <LinearGradient
        style={{ flex: 1 }}
        colors={[theme.colors.gradient[900], theme.colors.gradient[100]]}
      >
        <ImageBackground
          className="flex-1"
          imageStyle={{ opacity: 0.5 }}
          source={starsImg}
          resizeMode="repeat"
        >
          {children}
        </ImageBackground>
      </LinearGradient>
    </>
  );
};
