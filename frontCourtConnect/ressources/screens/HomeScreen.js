import { StyleSheet, View } from "react-native";
import OrangeButton from "../shared/OrangeButton";
import colors from "../style/color";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ onLogout }) {
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    onLogout();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.darkBlue }]}>
      <OrangeButton title="Get Started" />
      <OrangeButton title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
