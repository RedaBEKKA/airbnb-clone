import { useWarmUpBrowser } from "@/hooks/useWarmUpWindow";
import { useSignUp } from "@clerk/clerk-expo";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StatusBar,
  Pressable,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Svg, { Path } from "react-native-svg";

export default function Verify() {
  useWarmUpBrowser();
  const { isLoaded, signUp, setActive } = useSignUp();

  // State for verification code inputs
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // We'll use these refs to focus on the next input field
  const inputRefs = useRef<Array<TextInput | null>>([]);

  // Effect for countdown timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleCodeChange = (text: string, index: number) => {
    // Filter non-numeric characters
    const sanitizedText = text.replace(/[^0-9]/g, "");

    // Handle case where user pastes multiple digits into a single input
    if (sanitizedText.length > 1) {
      // If multiple digits are pasted into a single field, distribute them
      const digits = sanitizedText.split("");
      const newCode = [...code];

      // Fill as many fields as possible with the digits
      for (let i = 0; i < digits.length && index + i < 6; i++) {
        newCode[index + i] = digits[i];
      }

      setCode(newCode);

      // Focus on the last filled input or the end
      const focusIndex = Math.min(index + sanitizedText.length, 5);
      inputRefs.current[focusIndex]?.focus();
      return;
    }

    // Normal case - just one digit
    const newCode = [...code];
    newCode[index] = sanitizedText;
    setCode(newCode);

    // If a digit was entered, move to the next input
    if (sanitizedText.length === 1 && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  const handleKeyPress = (e: any, index: number) => {
    // If backspace was pressed and the field is empty, move to the previous input
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (!isLoaded) return;

    const verificationCode = code.join("");
    if (verificationCode.length !== 6) {
      setGeneralError("Veuillez entrer un code à 6 chiffres");
      return;
    }

    setIsSubmitting(true);
    setGeneralError("");

    try {
      // Attempt to verify the email address
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completeSignUp.status === "complete") {
        // Set the user session as active
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace("/");
      } else {
        // Verification is incomplete - handle next steps
        console.log("Verification incomplete. Status:", completeSignUp.status);
        setGeneralError(
          "La vérification n'est pas terminée. Veuillez réessayer."
        );
      }
    } catch (err: any) {
      console.error("Error verifying email:", err);
      setGeneralError(
        err?.errors?.[0]?.message ||
          "Échec de la vérification. Le code est peut-être incorrect ou expiré."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!isLoaded || resendTimer > 0) return;

    setIsResending(true);
    setGeneralError("");

    try {
      // Resend the verification email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Start the countdown timer (60 seconds)
      setResendTimer(60);
    } catch (err: any) {
      console.error("Error resending code:", err);
      setGeneralError(
        err?.errors?.[0]?.message ||
          "Échec de l'envoi du code. Veuillez réessayer plus tard."
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex-1 flex flex-col w-full">
        <View
          className="h-[32%] w-full bg-Primary flex justify-center items-center"
          style={{
            paddingTop: StatusBar.currentHeight,
          }}
        >
          <View className="h-[70%] w-[80%] flex flex-col justify-center gap-4 md:gap-6">
            <View className="flex flex-row items-center gap-2 md:gap-4">
              <Svg width="27" height="25" viewBox="0 0 27 25" fill="none">
                <Path
                  d="M26.5468 12.4465H11.1343L21.6009 15.1796L26.5468 16.4685V24.8852H0V12.7804L6.89488 -7.62939e-06H10.9169V12.3067L18.1301 -7.62939e-06H26.5468V12.4465Z"
                  fill="white"
                />
              </Svg>
              <Text className="text-white text-md md:text-xl font-semibold">
                EKreli
              </Text>
            </View>
            <View>
              <Text className="text-white text-lg md:text-2xl font-bold">
                Vérifiez votre
              </Text>
              <Text className="text-white text-lg md:text-2xl font-bold">
                adresse email
              </Text>
            </View>
            <View className="flex flex-row items-center gap-2 md:gap-4 ">
              <Text className="text-white text-xs md:text-md">
                Un code de vérification a été envoyé à votre adresse email.
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-1 flex justify-center items-center">
          <View className="w-[80%] flex flex-col gap-6 md:gap-8">
            {generalError ? (
              <View className="bg-red-50 p-3 rounded-lg border border-red-200">
                <Text className="text-red-600 text-center">{generalError}</Text>
              </View>
            ) : null}

            <Text className="text-center text-sm md:text-lg text-gray-600">
              Veuillez entrer le code à 6 chiffres envoyé à votre email.
            </Text>

            <View className="flex flex-row justify-between w-full px-4">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  className="w-12 h-12 md:w-14 md:h-14 border-2 border-Border rounded-md text-center  text-xs md:text-md"
                  maxLength={1}
                  keyboardType="number-pad"
                  selectTextOnFocus
                  value={code[index]}
                  onChangeText={(text) => handleCodeChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                />
              ))}
            </View>

            <Pressable
              className={`bg-Primary w-full py-5 px-6 md:py-6 md:px-7 rounded-lg ${
                isSubmitting ? "opacity-70" : "active:opacity-90"
              }`}
              onPress={handleVerify}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white text-center text-sm md:text-lg font-semibold">
                  Vérifier
                </Text>
              )}
            </Pressable>

            <View className="flex flex-row justify-center items-center">
              <Text className="text-sm md:text-md text-gray-600">
                Vous n'avez pas reçu de code ?{" "}
              </Text>
              <Pressable
                onPress={handleResendCode}
                disabled={isResending || resendTimer > 0}
              >
                <Text
                  className={`text-sm md:text-md font-medium ${
                    isResending || resendTimer > 0
                      ? "text-gray-400"
                      : "text-Primary"
                  }`}
                >
                  {resendTimer > 0
                    ? `Renvoyer (${resendTimer}s)`
                    : "Renvoyer le code"}
                </Text>
              </Pressable>
            </View>

            <Pressable onPress={() => router.back()} className="py-2">
              <Text className="text-center text-sm md:text-md text-gray-600">
                Retour
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
