import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import colors from "../style/color";

const Footer = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const isActive = (name) => route.name === name;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={styles.navItem}
      >
        <Image
          source={
            isActive("Home")
              ? require("../../assets/Home_orange.png")
              : require("../../assets/Home.png")
          }
          style={styles.icon}
        />
      </TouchableOpacity>

      <View style={styles.separator} />

      <TouchableOpacity
        onPress={() => navigation.navigate("Map")}
        style={styles.navItem}
      >
        <Image
          source={
            isActive("Map")
              ? require("../../assets/Map_orange.png")
              : require("../../assets/Map.png")
          }
          style={styles.icon}
        />
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
    borderTopWidth: 3,
    borderTopColor: colors.orange,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
  },
  separator: {
    width: 3,
    backgroundColor: colors.orange,
    alignSelf: "stretch",
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});

export default Footer;
