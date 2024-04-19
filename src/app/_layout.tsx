import { Stack } from "expo-router";

import { TRPCProvider } from "~/utils/api";

import "../global.css";
import "../translation";

export default function Layout() {
  return (
    <TRPCProvider>
      <Stack />
    </TRPCProvider>
  );
}
