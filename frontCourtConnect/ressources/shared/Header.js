import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import colors from "../constants/color";
import assets from "../constants/assets";
import ReturnButton from "./ReturnButton";

const Header = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ReturnButton
        onPress={() => {
          navigation.navigate("Map");
        }}
      />
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
