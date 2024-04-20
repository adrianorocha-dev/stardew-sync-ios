import { Stack, Link } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";

import { Button } from "~/components/Button";
import { Container } from "~/components/Container";
import { InternalizationExample } from "~/components/InternalizationExample";
import { ScreenContent } from "~/components/ScreenContent";
import { api } from "~/utils/api";

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: "Home" }} />
      <Container>
        <ScreenContent path="app/index.tsx" title="Home">
          <InternalizationExample />
        </ScreenContent>

        <View>
          <Link href="/login" asChild>
            <Button title="Login" onPress={() => {}} />
          </Link>

          <TRPCDemo />

          <Link href="/details" asChild>
            <Button title="Show Details" onPress={() => {}} />
          </Link>
        </View>
      </Container>
    </>
  );
}

function TRPCDemo() {
  const { data, isLoading, error } = api.hello.useQuery({ name: "Adriano" });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text className="text-red-500">{error.message}</Text>;
  }

  return (
    <View className="items-center justify-center">
      <Text>{data?.text}</Text>
    </View>
  );
}
