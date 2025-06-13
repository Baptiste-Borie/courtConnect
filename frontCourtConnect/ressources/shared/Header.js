import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../style/color";

const Header = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>CourtConnect</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 48,
    paddingVertical: 24,
    paddingHorizontal: 24,
    backgroundColor: colors.lightBlue,
  },
  text: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Header;
