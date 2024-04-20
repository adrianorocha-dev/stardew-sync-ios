import { Stack } from "expo-router";
import { ActivityIndicator } from "react-native";

import { Container } from "~/components/Container";
import { ScreenContent } from "~/components/ScreenContent";
import { api } from "~/utils/api";

export default function Details() {
  const { data: user, isLoading, error } = api.users.me.useQuery();

  return (
    <>
      <Stack.Screen options={{ title: "Details" }} />
      <Container>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <ScreenContent
            path="screens/details.tsx"
            title={
              error
                ? `Error: ${error.message}`
                : `Showing details for user ${user.name}`
            }
          />
        )}
      </Container>
    </>
  );
}
