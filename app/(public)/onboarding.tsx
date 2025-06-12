import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Pressable,
  View,
  Dimensions,
  Text,
  FlatList,
  Animated,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import * as SecureStore from "expo-secure-store";

export default function onboarding() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width
  );
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWindowWidth(window.width);
    });

    return () => subscription?.remove();
  }, []);

  const isMediumScreen = windowWidth >= 768;
  const imageSize = isMediumScreen ? 400 : 300;

  // Onboarding content for each screen
  const screens = [
    {
      color: "#FEBE3F",
      image: require("../../assets/images/illustration2.svg"),
      title: "Explorez des milliers d’annonces en Algérie.",
      description:
        "Des offres vérifiées, mises à jour quotidiennement. Trouvez facilement selon votre budget et vos préférences.",
    },
    {
      color: "#7F276B",
      image: require("../../assets/images/illustration.svg"),
      title: "Affinez votre recherche par wilaya, commune ou même quartier.",
      description:
        "Accédez à des infos détaillées sur chaque bien : photos, prix, commodités, et localisation précise.",
    },
    {
      color: "#E20046",
      image: require("../../assets/images/illustration3.svg"),
      title: "Sécurisez votre location avec des propriétaires vérifiés.",
      description:
        "Du premier clic à la remise des clés, on veille à chaque détail pour votre tranquillité. Vous réservez, on sécurise. Louez l’esprit libre.",
    },
  ];

  const handleNext = () => {
    if (currentScreen < 2) {
      flatListRef.current?.scrollToIndex({
        index: currentScreen + 1,
        animated: true,
      });
    }
  };

  const finishOnboarding = async () => {
    // Mark that user has visited the app
    await SecureStore.setItemAsync("hasVisitedBefore", "true");
    router.replace("/(auth)/signin");
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / windowWidth);
    if (newIndex !== currentScreen) {
      setCurrentScreen(newIndex);
    }
  };

  // Render each onboarding screen
  const renderItem = ({ item }: { item: any; index: number }) => {
    return (
      <View style={{ width: windowWidth, paddingHorizontal: 20 }}>
        <View className="flex-1 flex flex-col items-center justify-center gap-10 md:gap-20">
          {/* Image */}
          <View>
            <Image
              source={item.image}
              contentFit="contain"
              style={{ width: imageSize, height: imageSize }}
            />
          </View>

          {/* Logo */}
          <View>
            <Svg width="24" height="22" viewBox="0 0 24 22" fill="none">
              <Path
                d="M23.3733 10.6472H11.9601C11.7248 10.6472 11.6811 10.9865 11.9109 11.0466L19.341 12.989L23.4226 14.0559C23.5101 14.0778 23.5758 14.1598 23.5758 14.2528V21.0975C23.5758 21.2069 23.4828 21.2999 23.3733 21.2999H1.0612C0.951777 21.2999 0.858765 21.2069 0.858765 21.0975V10.9865C0.858765 10.9536 0.869707 10.9208 0.88065 10.888L6.69668 0.103955C6.72951 0.0382994 6.80064 0 6.87724 0H10.0014C10.1108 0 10.2038 0.0930128 10.2038 0.20244V9.78276C10.2038 9.99067 10.4774 10.0618 10.5813 9.88671L16.3153 0.0984841C16.3536 0.0382994 16.4193 0 16.4904 0H23.3733C23.4828 0 23.5758 0.0930128 23.5758 0.20244V10.4448C23.5758 10.5597 23.4882 10.6472 23.3733 10.6472Z"
                fill={item.color}
              />
            </Svg>
          </View>

          {/* Content */}
          <View className="flex flex-col items-center gap-2">
            <View>
              <Text
                className={`text-center text-md md:text-xl font-bold`}
                style={{ color: item.color }}
              >
                {item.title}
              </Text>
            </View>
            <View>
              <Text className="text-center text-sm md:text-lg text-Black px-4">
                {item.description}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // Shared progress indicator component
  const ProgressIndicator = () => (
    <View className="w-full h-10 md:h-16 flex flex-row justify-between gap-3 md:gap-5">
      <View
        className={`h-2 flex-1 rounded-full ${
          currentScreen === 0 ? "bg-Warning" : "bg-Muted-50"
        }`}
      />

      <View
        className={`h-2 flex-1 rounded-full ${
          currentScreen === 1 ? "bg-Purple" : "bg-Muted-50"
        }`}
      />
      <View
        className={`h-2 flex-1 rounded-full ${
          currentScreen === 2 ? "bg-Primary" : "bg-Muted-50"
        }`}
      />
    </View>
  );

  return (
    <View className="bg-white flex-1 pt-4 md:pt-8">
      <View className="flex-1 py-8 px-4">
        {/* Page indicators - always visible at the top */}
        <View className="py-4">
          <ProgressIndicator />
        </View>

        {/* Scrollable content */}
        <FlatList
          ref={flatListRef}
          data={screens}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          scrollEnabled={true}
          decelerationRate="fast"
          bounces={false} // Prevents over-scrolling
          snapToAlignment="center" // Critical for center alignment
          snapToInterval={windowWidth} // Snaps to exact window width
          contentContainerStyle={{ flexGrow: 0 }} // Prevents stretching
          style={{ flex: 1 }}
        />

        {/* Navigation buttons */}
        <View className="w-full flex flex-row gap-4 pt-4">
          {currentScreen < 2 ? (
            <Pressable
              className="bg-Muted-50 flex-1 py-5 px-6 md:py-6 md:px-7 rounded-lg active:opacity-90"
              onPress={handleNext}
            >
              <Text className="text-Black text-center text-md md:text-lg font-semibold">
                Suivant
              </Text>
            </Pressable>
          ) : (
            <Pressable
              className="bg-Primary flex-1 py-5 px-6 md:py-6 md:px-7 rounded-lg active:opacity-90"
              onPress={finishOnboarding}
            >
              <Text className="text-white text-center text-md md:text-lg font-semibold">
                Commencer
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
