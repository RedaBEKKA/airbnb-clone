import React, { useEffect } from "react";
import { Text, View, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function launch() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMediumScreen = width >= 768;
  const imageSize = isMediumScreen ? 150 : 100;

  useEffect(() => {
    const checkFirstVisit = async () => {
      try {
        // Check if user has visited before
        const hasVisitedBefore = await SecureStore.getItemAsync(
          "hasVisitedBefore"
        );

        // Set a timeout for visual effect
        const timer = setTimeout(() => {
          if (hasVisitedBefore === "true") {
            // If visited before, go directly to home
            router.replace("/");
          } else {
            // First time user, show onboarding
            router.replace("/(public)/onboarding");
          }
        }, 2000);

        return () => clearTimeout(timer);
      } catch (error) {
        console.error("Error checking first visit:", error);
        // Fallback to onboarding if there's an error
        router.replace("/(public)/onboarding");
      }
    };

    checkFirstVisit();
  }, [router]);

  return (
    <LinearGradient
      colors={["#E20046", "#FF3D79"]}
      className="w-full h-full flex items-center justify-center"
    >
      <Image
        source={require("../../assets/images/icon.svg")}
        style={{
          width: imageSize,
          height: imageSize,
        }}
        contentFit="contain"
      />
    </LinearGradient>
  );
}
