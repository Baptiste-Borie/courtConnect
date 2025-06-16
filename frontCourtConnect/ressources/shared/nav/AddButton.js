import React from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { useTheme } from "../../context/ThemeContext";

const AddButton = ({ onPress }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={onPress}
      >
        <Text style={styles.plus}>＋</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    bottom: 0,
    alignSelf: "center",
    zIndex: 10,
  },
  button: {
    width: 90,
    height: 90,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  plus: {
    fontSize: 36,
    color: "white",
    lineHeight: 36,
    marginTop: -2,
  },
});

export default AddButton;
