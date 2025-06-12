import CheckBox from "@/components/ui/CheckBox";
import CustomInput from "@/components/ui/CustomInput";
import Divider from "@/components/ui/Divider";
import { useWarmUpBrowser } from "@/hooks/useWarmUpWindow";
import { useSignUp, useSSO } from "@clerk/clerk-expo";
import { router } from "expo-router";
import React, { useState } from "react";
import * as WebBrowser from "expo-web-browser";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { CountryPicker } from "react-native-country-codes-picker";

import {
  Text,
  View,
  StatusBar,
  Pressable,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import Svg, { Defs, Path } from "react-native-svg";
import { z } from "zod";
import { Ionicons } from "@expo/vector-icons";

// Define validation schema
const signUpSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit avoir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit avoir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  birthDate: z.date().refine((date) => {
    const age = new Date().getFullYear() - date.getFullYear();
    return age >= 18;
  }, "Vous devez avoir au moins 18 ans"),
  phoneNumber: z.string().min(6, "Numéro de téléphone invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
});

WebBrowser.maybeCompleteAuthSession();

export default function Signup() {
  const [termsAccepted, setTermsAccepted] = useState(false);
  useWarmUpBrowser();
  const { signUp, setActive, isLoaded } = useSignUp();
  const { startSSOFlow } = useSSO();

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+33");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState("");

  // Date picker state
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  // Country picker state
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const validateForm = (): boolean => {
    try {
      signUpSchema.parse({
        firstName,
        lastName,
        email,
        birthDate,
        phoneNumber: `${countryCode}${phoneNumber}`,
        password,
      });
      if (!birthDate) {
        setErrors({ ...errors, birthDate: "La date de naissance est requise" });
        return false;
      }

      if (!termsAccepted) {
        setErrors({ ...errors, terms: "Vous devez accepter les conditions" });
        return false;
      }

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

  const handleSignUp = async () => {
    if (!isLoaded) return;
    setGeneralError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
        unsafeMetadata: {
          phoneNumber: `${countryCode}${phoneNumber}`,

          birthday: birthDate?.toISOString().split("T")[0],
        },
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/");
      } else {
        // Handle verification flow
        router.push("/(auth)/verify");
      }
    } catch (err: any) {
      console.error("Error signing up:", err);
      setGeneralError(
        err?.errors?.[0]?.message ||
          "Failed to sign up. Please check your information."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleDateConfirm = (date: Date) => {
    setBirthDate(date);
    setDatePickerVisible(false);
  };

  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("fr-FR");
  };

  return (
    <ScrollView className="bg-white flex-1">
      <View className="h-screen flex flex-col w-full">
        <View
          className="h-[32%] w-full bg-Warning flex justify-center items-center"
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
                Créez votre
              </Text>
              <Text className="text-white text-lg md:text-2xl font-bold">
                compte
              </Text>
            </View>
            <View className="flex flex-row items-center gap-2 md:gap-4 ">
              <Text className="text-white text-xs md:text-md">
                Vous avez déjà un compte ?
              </Text>
              <Pressable onPress={() => router.push("/(auth)/signin")}>
                <Text className="text-Primary text-xs md:text-md">Sign In</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View className="w-[80%] flex flex-col justify-between items-center py-6 md:py-8">
            <View className="flex flex-col gap-4 md:gap-6">
              {generalError ? (
                <View className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <Text className="text-red-600 text-center">
                    {generalError}
                  </Text>
                </View>
              ) : null}

              {/* First Name and Last Name in same row */}
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <CustomInput
                    label="Prénom"
                    placeholder="Prénom"
                    value={firstName}
                    onChangeText={setFirstName}
                    error={errors.firstName}
                  />
                </View>
                <View className="flex-1">
                  <CustomInput
                    label="Nom"
                    placeholder="Nom"
                    value={lastName}
                    onChangeText={setLastName}
                    error={errors.lastName}
                  />
                </View>
              </View>

              <CustomInput
                label="Email"
                placeholder="Votre adresse email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                error={errors.email}
              />

              {/* Date of Birth with Picker */}
              <View className="flex flex-col gap-2 md:gap-4">
                <Text className="text-sm md:text-lg text-Muted">
                  Date de naissance
                </Text>
                <Pressable
                  className="border rounded-xl border-Border overflow-hidden py-4 px-5 md:py-5 md:px-6"
                  onPress={() => setDatePickerVisible(true)}
                >
                  <Text className="text-sm md:text-lg">
                    {birthDate
                      ? formatDate(birthDate)
                      : "Sélectionner une date"}
                  </Text>
                </Pressable>
                {errors.birthDate && (
                  <Text className="text-xs text-red-500">
                    {errors.birthDate}
                  </Text>
                )}
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleDateConfirm}
                  onCancel={() => setDatePickerVisible(false)}
                  maximumDate={new Date()}
                />
              </View>

              {/* Phone number with country code */}
              <View className="flex flex-col gap-2 md:gap-4">
                <Text className="text-sm md:text-lg text-Muted">
                  Numéro de téléphone
                </Text>
                <View className="flex-row">
                  <Pressable
                    className="border rounded-l-xl border-Border overflow-hidden py-4 px-5 flex-row items-center md:py-5 md:px-6"
                    onPress={() => setShowCountryPicker(true)}
                  >
                    <Text className="text-sm md:text-lg">{countryCode}</Text>
                    <Ionicons
                      name="chevron-down"
                      size={16}
                      color="#71717A"
                      style={{ marginLeft: 3 }}
                    />
                  </Pressable>
                  <TextInput
                    className="border rounded-r-xl border-l-0 border-Border flex-1 py-2 px-3 text-sm md:text-lg"
                    placeholder="Numéro de téléphone"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                  />

                  <CountryPicker
                    lang="fr"
                    show={showCountryPicker}
                    // when picker button press you will get the country object with dial code
                    pickerButtonOnPress={(item) => {
                      setCountryCode(item.dial_code);
                      setShowCountryPicker(false);
                    }}
                    onBackdropPress={() => setShowCountryPicker(false)}
                    style={{
                      modal: {
                        height: 400,
                      },
                    }}
                  />
                </View>
                {errors.phoneNumber && (
                  <Text className="text-xs text-red-500">
                    {errors.phoneNumber}
                  </Text>
                )}
              </View>

              <CustomInput
                label="Mot de passe"
                placeholder="Mot de passe"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
                icon={showPassword ? "eye-outline" : "eye-off-outline"}
                onIconPress={togglePasswordVisibility}
                error={errors.password}
              />

              <CheckBox
                label="J'accepte les conditions d'utilisation et la politique de confidentialité"
                isChecked={termsAccepted}
                onChange={setTermsAccepted}
                checkBoxColor="#6C7278"
                textColor="Muted"
              />
              {errors.terms && (
                <Text className="text-xs text-red-500 ml-8 -mt-2">
                  {errors.terms}
                </Text>
              )}

              <Pressable
                className={`bg-Warning min-w-full py-5 px-6 md:py-6 md:px-7 rounded-lg mt-3 md:mt-5
                 ${isSubmitting ? "opacity-70" : "active:opacity-90"}`}
                onPress={handleSignUp}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white text-center text-sm md:text-lg font-semibold">
                    S'inscrire
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
}
