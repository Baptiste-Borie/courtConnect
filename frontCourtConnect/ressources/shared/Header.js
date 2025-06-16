import { View, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";

import { ThemeContext } from "../context/ThemeContext";
import ReturnButton from "./ReturnButton";

const Header = ({ content }) => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      <ReturnButton
        onPress={() => {
          navigation.goBack();
        }}
      />
      <Text style={[styles.title, { color: theme.text }]}>{content}</Text>
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
});

export default Header;
