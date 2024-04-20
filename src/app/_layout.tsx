import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { TRPCProvider } from "~/utils/api";
import { AuthProvider } from "~/utils/auth";

import "../global.css";
import "../translation";

export default function Layout() {
  return (
    <AuthProvider>
      <TRPCProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />

        <StatusBar />
      </TRPCProvider>
    </AuthProvider>
  );
}
