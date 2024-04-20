import { Stack } from "expo-router";

import { TRPCProvider } from "~/utils/api";
import { AuthProvider } from "~/utils/auth";

import "../global.css";
import "../translation";

export default function Layout() {
  return (
    <AuthProvider>
      <TRPCProvider>
        <Stack />
      </TRPCProvider>
    </AuthProvider>
  );
}
