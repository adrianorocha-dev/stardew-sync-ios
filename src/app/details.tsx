import { Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";

import { Container } from "~/components/Container";
import { ScreenContent } from "~/components/ScreenContent";
import { api } from "~/utils/api";

export default function Details() {
  const { name } = useLocalSearchParams();

  return (
    <>
      <Stack.Screen options={{ title: "Details" }} />
      <Container>
        <ScreenContent
          path="screens/details.tsx"
          title={`Showing details for user ${name}`}
        />

        <View className="items-center justify-center p-4">
          <TRPCDemo />
        </View>
      </Container>
    </>
  );
}

function TRPCDemo() {
  const { data, isLoading, error } = api.listUsers.useQuery();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text className="text-red-500">{error.message}</Text>;
  }

  console.log(process.env);

  return <Text>{data?.length}</Text>;
}
