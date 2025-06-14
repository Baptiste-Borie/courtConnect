import { StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";

import OrangeButton from "../shared/OrangeButton";
import PageLayout from "../shared/PageLayout";
import ProfileButton from "../shared/ProfileButton";
import { ThemeContext } from "../context/ThemeContext";

export default function HomeScreen({ navigation, onLogout }) {
  const { theme } = useContext(ThemeContext);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    onLogout();
  };

  return (
    <PageLayout
      style={[styles.content, { backgroundColor: theme.background }]}
      showHeader={false}
    >
      <ProfileButton style={{ position: "absolute", top: 50, right: 20 }} />
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
