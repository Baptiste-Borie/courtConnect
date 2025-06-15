import React, { useContext } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { ThemeContext } from "../context/ThemeContext";

const ReturnButton = ({ onPress, style }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.text, { color: theme.text }]}>← RETOUR</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "transparent",
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default ReturnButton;
