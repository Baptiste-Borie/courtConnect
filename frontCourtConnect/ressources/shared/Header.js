import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import colors from "../constants/color";
import ReturnButton from "./ReturnButton";

const Header = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
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
    backgroundColor: colors.orange,
    position: "relative",
    justifyContent: "flex-end",
    paddingBottom: 10,
    paddingLeft: 10,
  },
});

export default Header;
