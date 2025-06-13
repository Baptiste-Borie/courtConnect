import { StyleSheet, View } from "react-native";
import OrangeButton from "../shared/OrangeButton";
import colors from "../style/color";

export default function HomeScreen({ navigation }) {
  return (
    <View style={[styles.container, { backgroundColor: colors.darkBlue }]}>
      <OrangeButton
        title="Get Started"
        onPress={() => navigation.navigate("Register")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
