import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import assets from "../constants/assets";

const IconNavigationButton = ({ style }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={() => navigation.navigate("Account")}
    >
      <Image source={assets.icons.account} style={styles.icon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
  icon: {
    width: 48,
    height: 48,
    resizeMode: "contain",
  },
});

export default IconNavigationButton;
