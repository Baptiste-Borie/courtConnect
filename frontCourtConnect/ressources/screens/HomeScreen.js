import { StyleSheet, View } from "react-native";
import OrangeButton from "../shared/OrangeButton";
import PageLayout from "../shared/PageLayout";
import colors from "../style/color";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ navigation, onLogout }) {
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    onLogout();
  };

  return (
    <PageLayout style={styles.content}>
      <OrangeButton
        title="Get Started"
        onPress={() => navigation.navigate("Map")}
      />
      <OrangeButton title="Logout" onPress={handleLogout} />
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
