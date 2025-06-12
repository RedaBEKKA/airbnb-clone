import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CheckBoxProps {
  label: string;
  isChecked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  checkBoxColor?: string;
  textColor?: string;
  size?: number;
}

const CheckBox: React.FC<CheckBoxProps> = ({
  label,
  isChecked,
  onChange,
  disabled = false,
  checkBoxColor = "#000",
  textColor = "#000",
  size = 24,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => !disabled && onChange(!isChecked)}
      disabled={disabled}
      className="flex-row items-center my-1"
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isChecked, disabled }}
    >
      <View
        className={`flex-row items-center justify-center rounded-md mr-2 ${
          disabled ? "opacity-50" : ""
        }`}
      >
        {isChecked ? (
          <Ionicons name="checkbox" size={size} color={checkBoxColor} />
        ) : (
          <Ionicons name="square-outline" size={size} color={checkBoxColor} />
        )}
      </View>
      <Text
        className={`text-sm md:text-lg text-${textColor} flex-shrink ${
          disabled ? "opacity-50" : ""
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default CheckBox;
