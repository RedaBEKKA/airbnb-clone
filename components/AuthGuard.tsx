import { useAuth } from "@clerk/clerk-expo";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export function useProtectedRoute() {
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inProtectedGroup =
      segments[0] === "(app)" || segments[0] === "(protected)";

    if (isSignedIn && inAuthGroup) {
      // Redirect signed-in users from auth screens to home
      router.replace("/");
    } else if (!isSignedIn && inProtectedGroup) {
      // Redirect unauthenticated users to sign-in
      router.replace("/(auth)/signin");
    }
  }, [isSignedIn, isLoaded, segments]);
}
