import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { Stack } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';




export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GluestackUIProvider mode="light" ><Stack
        screenOptions={{
          headerShown: false,
        }} /></GluestackUIProvider>
    </SafeAreaView>
  );
}
