import React from "react";
import { View, Text, TextInput, TextInputProps, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CustomInputProps extends TextInputProps {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  error?: string;
  onIconPress?: () => void;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  icon,
  iconColor = "#71717A",
  error,
  onIconPress,
  ...textInputProps
}) => {
  return (
    <View className="flex flex-col gap-2 md:gap-4">
      <Text className="text-sm md:text-lg text-Muted">{label}</Text>
      <View className="flex flex-row items-center border rounded-xl border-Border overflow-hidden">
        <TextInput
          className={`py-4 px-6 md:py-5 text-sm md:text-lg ${
            icon ? "flex-1 pr-12" : "flex-1"
          }`}
          {...textInputProps}
        />
        {icon && (
          <Pressable
            className="absolute right-0 h-full px-4 justify-center"
            onPress={onIconPress}
            disabled={!onIconPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name={icon} size={20} color={iconColor} />
          </Pressable>
        )}
      </View>
      {error && <Text className="text-xs text-Danger">{error}</Text>}
    </View>
  );
};

export default CustomInput;
