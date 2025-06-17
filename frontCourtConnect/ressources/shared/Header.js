import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";

import { ThemeContext } from "../context/ThemeContext";
import ReturnButton from "./ReturnButton";
import OrangeButton from "./OrangeButton";
import assets from "../constants/assets";

const Header = ({ content, onLogout }) => {
  const navigation = useNavigation();

  const { theme } = useContext(ThemeContext);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    onLogout();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      <ReturnButton
        onPress={() => {
          navigation.goBack();
        }}
      />

      <Text style={[styles.title, { color: theme.text }]}>{content}</Text>
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Image source={assets.icons.logout} style={{ width: 24, height: 24 }} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    position: "relative",
    justifyContent: "flex-end",
    paddingBottom: 10,
    paddingLeft: 10,
  },
  title: {
    position: "absolute",
    bottom: 10, // même que le paddingBottom de container
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 18,
    pointerEvents: "none", // pour éviter que le texte bloque les interactions avec ReturnButton
  },
  logout: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});

export default Header;
