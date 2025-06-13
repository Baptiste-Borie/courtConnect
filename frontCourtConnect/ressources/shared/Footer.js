import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../style/color";

const Footer = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={styles.navItem}
      >
        <Text style={styles.text}>Accueil</Text>
      </TouchableOpacity>

      <View style={styles.separator} />

      <TouchableOpacity
        onPress={() => navigation.navigate("Map")}
        style={styles.navItem}
      >
        <Text style={styles.text}>Carte</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: 80,
    backgroundColor: colors.lightBlue,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
  },
  separator: {
    width: 1,
    backgroundColor: colors.darkBlue,
    alignSelf: "stretch",
  },

  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "500",
  },
});

export default Footer;
