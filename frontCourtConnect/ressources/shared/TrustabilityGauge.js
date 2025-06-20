import React from "react";
import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function TrustabilityGauge({
  value = 0,
  size = 120,
  strokeWidth = 10,
}) {
  const { theme } = useContext(ThemeContext);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20,
      }}
    >
      <Svg width={size} height={size}>
        <Circle
          stroke="#e6e6e6"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={theme.primary}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <Text style={{ fontSize: 18, marginTop: 10, color: theme.text }}>
        {value} / 100
      </Text>
      <Text style={{ color: theme.text }}>Points de confiance</Text>
    </View>
  );
}
