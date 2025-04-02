import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack initialRouteName="homescreen">
        {/* Login Screen */}
        <Stack.Screen name="index" options={{ headerShown: false }} />

        {/* Home Screen */}
        <Stack.Screen name="homescreen" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
