import CheckBox from "@/components/ui/CheckBox";
import CustomInput from "@/components/ui/CustomInput";
import Divider from "@/components/ui/Divider";
import { useWarmUpBrowser } from "@/hooks/useWarmUpWindow";
import { useSignIn, useSSO } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import React, { useCallback, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";

import {
  Text,
  View,
  StatusBar,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, {
  Defs,
  Path,
  Stop,
  LinearGradient,
  G,
  ClipPath,
} from "react-native-svg";
import { z } from "zod";

// Define validation schema
const signInSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
});

WebBrowser.maybeCompleteAuthSession();

export default function Signin() {
  const [rememberMe, setRememberMe] = useState(false);
  useWarmUpBrowser();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startSSOFlow } = useSSO();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const validateForm = (): boolean => {
    try {
      signInSchema.parse({ email, password });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            formattedErrors[err.path[0]] = err.message;
          }
        });
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  const handleSignIn = async () => {
    if (!isLoaded) return;
    setGeneralError("");

    if (!validateForm()) {
      return;
    } 

    setIsSubmitting(true);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        // Set the user as active
        await setActive({ session: result.createdSessionId });
        // Navigate to home screen
        router.replace("/");
      } else {
        // Handle incomplete sign-in
        setGeneralError("Authentication incomplete. Please try again.");
      }
    } catch (err: any) {
      console.error("Error signing in:", err);
      setGeneralError(
        err?.errors?.[0]?.message ||
          "Failed to sign in. Please check your credentials."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleOAuthSignIn = useCallback(async (strategy: "oauth_google" | "oauth_facebook") => {
    if (!isLoaded) return;
    setIsSubmitting(true);
    setGeneralError("");
    
    try {
      const { createdSessionId, setActive: setActiveSession } = await startSSOFlow({
        strategy,
        redirectUrl: AuthSession.makeRedirectUri({
          scheme: "airbnb" // Your app scheme
        }),
      });

      if (createdSessionId && setActiveSession) {
        await setActiveSession({ session: createdSessionId });
        router.replace("/");
      }
    } catch (err: any) {
      console.error("OAuth error:", err);
      setGeneralError("Social login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [isLoaded, startSSOFlow]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View className="bg-white flex-1">
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
                Connectez-vous à
              </Text>
              <Text className="text-white text-lg md:text-2xl font-bold">
                {" "}
                votre compte
              </Text>
            </View>
            <View className="flex flex-row items-center gap-2 md:gap-4 ">
              <Text className="text-white text-xs md:text-md">
                Vous n'avez pas de compte ?
              </Text>
              <Pressable onPress={() => router.push("/(auth)/signup")}>
                <Text className="text-Warning text-xs md:text-md">Sign Up</Text>
              </Pressable>
            </View>
          </View>
        </View>
        <View className="flex-1 flex justify-center items-center">
          <View className="h-[80%] w-[80%] flex flex-col justify-between items-center">
            <View className="flex flex-col gap-4 md:gap-6">
              {generalError ? (
                <View className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <Text className="text-red-600 text-center">
                    {generalError}
                  </Text>
                </View>
              ) : null}

              <CustomInput
                label="Email"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                error={errors.email}
              />
              <CustomInput
                label="Mot de passe"
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
                icon={showPassword ? "eye-outline" : "eye-off-outline"}
                onIconPress={togglePasswordVisibility}
                error={errors.password}
              />
              <View className="flex flex-row items-center justify-between">
                <CheckBox
                  label="Remember me"
                  isChecked={rememberMe}
                  onChange={setRememberMe}
                  textColor="Muted"
                  checkBoxColor="#6C7278"
                />
                <Link href={"/"} className="text-[#4D81E7] text-xs md:text-md">
                  Mot de passe oublié ?
                </Link>
              </View>
              <Pressable
                className={`bg-Primary min-w-full py-5 px-6 md:py-6 md:px-7 rounded-lg mt-3 md:mt-5
                   ${isSubmitting ? "opacity-70" : "active:opacity-90"}`}
                onPress={handleSignIn}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white text-center text-sm md:text-lg font-semibold">
                    Connexion
                  </Text>
                )}
              </Pressable>

              <Divider text="Ou se connecter avec" />
              <View className="flex flex-row items-center justify-between gap-4 md:gap-6">
                <Pressable
                  onPress={() => handleOAuthSignIn("oauth_google")}
                  className="flex-1 py-4 px-6 md:py-5 md:px-8 rounded-lg border border-Border flex flex-row items-center justify-center gap-2 md:gap-3"
                >
                  <Svg width="18" height="18" fill="none" viewBox="0 0 18 18">
                    <Path
                      fill="#4285F4"
                      d="M16.876 9.175c0-.648-.054-1.12-.17-1.61H9.162v2.922h4.428c-.09.727-.571 1.82-1.643 2.555l-.015.098 2.386 1.811.165.016c1.518-1.373 2.393-3.395 2.393-5.792"
                    ></Path>
                    <Path
                      fill="#34A853"
                      d="M9.161 16.875c2.17 0 3.991-.7 5.321-1.908l-2.535-1.925c-.679.464-1.59.788-2.786.788a4.83 4.83 0 0 1-4.571-3.273l-.095.008-2.48 1.882-.033.088c1.322 2.572 4.036 4.34 7.179 4.34"
                    ></Path>
                    <Path
                      fill="#7F276B"
                      d="M4.59 10.558A4.8 4.8 0 0 1 4.322 9c0-.543.098-1.068.26-1.558l-.005-.104-2.512-1.911-.082.038A7.75 7.75 0 0 0 1.126 9c0 1.269.312 2.467.857 3.535z"
                    ></Path>
                    <Path
                      fill="#EB4335"
                      d="M9.161 4.17c1.509 0 2.527.639 3.107 1.173l2.268-2.17c-1.393-1.27-3.205-2.048-5.375-2.048-3.143 0-5.857 1.767-7.179 4.34l2.599 1.977A4.85 4.85 0 0 1 9.16 4.17"
                    ></Path>
                  </Svg>
                  <Text className="text-sm md:text-lg">Google</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleOAuthSignIn("oauth_facebook")}
                  className="flex-1 py-4 px-6 md:py-5 md:px-8 rounded-lg border border-Border flex flex-row items-center justify-center gap-2 md:gap-3"
                >
                  <Svg width="18" height="18" fill="none" viewBox="0 0 18 18">
                    <G clipPath="url(#clip0_558_2122)">
                      <Path
                        fill="url(#paint0_linear_558_2122)"
                        d="M7.515 17.91C3.24 17.145 0 13.455 0 9c0-4.95 4.05-9 9-9s9 4.05 9 9c0 4.455-3.24 8.145-7.515 8.91l-.495-.405H8.01z"
                      ></Path>
                      <Path
                        fill="#fff"
                        d="M12.51 11.52 12.915 9H10.53V7.245c0-.72.27-1.26 1.35-1.26h1.17V3.69c-.63-.09-1.35-.18-1.98-.18-2.07 0-3.51 1.26-3.51 3.51V9H5.31v2.52h2.25v6.345a8.3 8.3 0 0 0 2.97 0V11.52z"
                      ></Path>
                    </G>
                    <Defs>
                      <LinearGradient
                        id="paint0_linear_558_2122"
                        x1="9"
                        x2="9"
                        y1="17.374"
                        y2="-0.003"
                        gradientUnits="userSpaceOnUse"
                      >
                        <Stop stopColor="#0062E0"></Stop>
                        <Stop offset="1" stopColor="#19AFFF"></Stop>
                      </LinearGradient>
                      <ClipPath id="clip0_558_2122">
                        <Path fill="#fff" d="M0 0h18v18H0z"></Path>
                      </ClipPath>
                    </Defs>
                  </Svg>
                  <Text className="text-sm md:text-lg">Facebook</Text>
                </Pressable>
              </View>
            </View>
            <View className="">
              <Text className="text-Muted text-center text-xs md:text-lg ">
                En vous inscrivant, vous acceptez les{" "}
                <Text className="text-Primary">conditions de service</Text> et
                l'accord sur le traitement des données.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
