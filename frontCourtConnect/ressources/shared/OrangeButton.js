import React, { useContext } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { ThemeContext } from "../context/ThemeContext";

const OrangeButton = ({ title, onPress }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme.primary }]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: theme.text }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default OrangeButton;
