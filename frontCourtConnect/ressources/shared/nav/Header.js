import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";

import { ThemeContext } from "../../context/ThemeContext";
import ReturnButton from "../ReturnButton";
import assets from "../../constants/assets";

const Header = ({ content, onLogout }) => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    onLogout();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      <ReturnButton onPress={() => navigation.goBack()} />

      <Text style={[styles.title, { color: theme.text }]}>{content}</Text>

      {onLogout && (
        <TouchableOpacity
          style={styles.logoutTouchArea}
          onPress={handleLogout}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // facultatif, pour encore plus de confort
        >
          <Image
            source={assets.icons.logout}
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
      )}
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
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 18,
    pointerEvents: "none",
  },
  logoutTouchArea: {
    position: "absolute",
    bottom: 5,
    right: 10,
    padding: 10,
    paddingVertical: 5,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Header;
