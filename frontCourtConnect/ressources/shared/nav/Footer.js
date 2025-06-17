import { useContext, useState } from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import assets from "../../constants/assets";
import AuthContext from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";
import AddButton from "./AddButton";
import AddModal from "../../screens/AddModal";

const Footer = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { isAuthenticated } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [modalVisible, setModalVisible] = useState(false);

  const isActive = (name) => route.name === name;

  if (!isAuthenticated) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.background_light,
            borderTopColor: theme.primary,
          },
        ]}
      >
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
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background_light,
          borderTopColor: theme.primary,
        },
      ]}
    >
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

      <AddButton onPress={() => setModalVisible(true)} />

      <AddModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddTerrain={() => {
          setModalVisible(false);
          navigation.navigate("AddTerrain");
        }}
        onAddEvent={() => {
          setModalVisible(false);
          navigation.navigate("AddEvent");
        }}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate("Map")}
        style={styles.navItem}
      >
        <Image
          source={isActive("Map") ? assets.icons.map_active : assets.icons.map}
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
    paddingBottom: 10,
    borderTopWidth: 2,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
  },
  separator: {
    width: 3,
    alignSelf: "stretch",
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});

export default Footer;
