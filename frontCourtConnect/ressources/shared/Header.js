import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";

import { ThemeContext } from "../context/ThemeContext";
import ReturnButton from "./ReturnButton";

const Header = () => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      <ReturnButton
        style={styles.returnButton}
        onPress={() => {
          navigation.goBack();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 80,
    position: "relative",
    justifyContent: "flex-end",
    paddingBottom: 10,
    paddingLeft: 10,
  },
  returnButton: {
    // style éventuellement fourni via props
  },
});

export default Header;
