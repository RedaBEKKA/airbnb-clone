import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import "react-native-reanimated";

import * as SecureStore from "expo-secure-store";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import "../global.css";
import * as WebBrowser from "expo-web-browser";
import { useProtectedRoute } from "@/components/AuthGuard";

// Make sure to call this at the module level

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(auth)/launch",
};
const CLERK_PUBLISHACLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const tokenCashe = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (error) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (error) {
      return;
    }
  },
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
WebBrowser.maybeCompleteAuthSession();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    mon: require("../assets/fonts/Montserrat-Regular.ttf"),
    "mon-sb": require("../assets/fonts/Montserrat-SemiBold.ttf"),
    "mon-b": require("../assets/fonts/Montserrat-Bold.ttf"),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider
      tokenCache={tokenCashe}
      publishableKey={CLERK_PUBLISHACLE_KEY!}
    >
      {loaded && <RootLayoutNav />}
    </ClerkProvider>
  );
}

function RootLayoutNav() {
  const router = useRouter();
  useProtectedRoute();

  return (
    <Stack>
      <Stack.Screen
        name="(public)/launch"
        options={{
          title: "Lancez l'application",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(auth)/signin"
        options={{
          title: "Se connecter",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(auth)/signup"
        options={{
          title: "S'inscrire",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(auth)/verify"
        options={{
          title: "Vérification",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="(public)/onboarding"
        options={{
          title: "Bienvenue",
          headerShown: false,
          animation: "slide_from_bottom",
        }}
      />

      <Stack.Screen name="(protected)" options={{ headerShown: false }} />

      <Stack.Screen name="(listing)/[id]" options={{ headerTitle: "" }} />
      <Stack.Screen
        name="(public)/booking"
        options={{
          presentation: "transparentModal",
          animation: "fade",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close-outline" size={28} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
