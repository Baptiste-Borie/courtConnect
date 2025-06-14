import { useContext } from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import colors from "../constants/color";
import assets from "../constants/assets";
import AuthContext from "../context/AuthContext";

const Footer = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { isAuthenticated } = useContext(AuthContext);

  const isActive = (name) => route.name === name;

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Auth")}
          style={styles.navItem}
        >
          <Image
            source={
              isActive("Auth")
                ? assets.icons.person_active
                : assets.icons.person
            }
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={styles.navItem}
      >
        <Image
          source={
            isActive("Home") ? assets.icons.home_active : assets.icons.home
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
          source={isActive("Map") ? assets.icons.map_active : assets.icons.map}
          style={styles.icon}
        />
      </TouchableOpacity>

      <View style={styles.separator} />
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
    paddingBottom: 10,
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
