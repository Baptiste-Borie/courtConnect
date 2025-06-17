import { StyleSheet, View } from "react-native";
import { useContext } from "react";

import OrangeButton from "../shared/OrangeButton";
import PageLayout from "../shared/PageLayout";
import ProfileButton from "../shared/ProfileButton";
import { ThemeContext } from "../context/ThemeContext";

export default function HomeScreen({ navigation, onLogout }) {
  const { theme } = useContext(ThemeContext);

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
