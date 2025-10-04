
import React, { useEffect } from "react";
import { Stack, router } from "expo-router";
import { SystemBars } from "react-native-edge-to-edge";
import "react-native-reanimated";
import { useColorScheme, Alert } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useNetworkState } from "expo-network";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import { Button } from "@/components/button";
import { WidgetProvider } from "@/contexts/WidgetContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { colors } from "@/styles/commonStyles";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Custom theme based on our color scheme
const CustomLightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.card,
    text: colors.text,
    border: '#e0e0e0',
    notification: colors.secondary,
  },
};

const CustomDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.card,
    text: colors.text,
    border: '#e0e0e0',
    notification: colors.secondary,
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const networkState = useNetworkState();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <WidgetProvider>
          <ThemeProvider value={colorScheme === 'dark' ? CustomDarkTheme : CustomLightTheme}>
            <SystemBars style="auto" />
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
              }}
            >
              <Stack.Screen name="splash" />
              <Stack.Screen name="auth/login" />
              <Stack.Screen name="auth/signup" />
              <Stack.Screen name="auth/forgot-password" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="modal" options={{ presentation: "modal" }} />
              <Stack.Screen name="formsheet" options={{ presentation: "formSheet" }} />
              <Stack.Screen name="transparent-modal" options={{ presentation: "transparentModal" }} />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </WidgetProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
