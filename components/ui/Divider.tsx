import React from "react";
import { View, Text } from "react-native";

interface DividerProps {
  text?: string;
  lineColor?: string;
  textColor?: string;
  thickness?: number;
  className?: string;
}

const Divider: React.FC<DividerProps> = ({
  text,
  lineColor = "#EDF1F3",
  textColor = "#6C7278",
  thickness = 1,
  className = "",
}) => {
  // If there's no text, render a simple line
  if (!text) {
    return (
      <View
        className={`w-full my-4 ${className}`}
        style={{ height: thickness, backgroundColor: lineColor }}
      />
    );
  }

  // Render a divider with text in the center
  return (
    <View className={`w-full flex-row items-center my-3 md:my-5 ${className}`}>
      <View
        className="flex-1"
        style={{ height: thickness, backgroundColor: lineColor }}
      />
      <Text className="px-4 text-sm" style={{ color: textColor }}>
        {text}
      </Text>
      <View
        className="flex-1"
        style={{ height: thickness, backgroundColor: lineColor }}
      />
    </View>
  );
};

export default Divider;
