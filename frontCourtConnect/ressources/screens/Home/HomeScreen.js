import { StyleSheet, View } from "react-native";
import { useContext } from "react";

import PageLayout from "../../shared/PageLayout";
import ProfileButton from "../../shared/ProfileButton";
import { ThemeContext } from "../../context/ThemeContext";
import NearestEvent from "./NearestEvent";

export default function HomeScreen({ navigation, onLogout }) {
  const { theme } = useContext(ThemeContext);

  return (
    <PageLayout
      style={[styles.content, { backgroundColor: theme.background }]}
      showHeader={false}
    >
      <ProfileButton style={{ position: "absolute", top: 50, right: 20 }} />

      <View style={styles.eventsContainer}>
        <NearestEvent style={styles.nearest} />
        <NearestEvent style={styles.nearest} />
        <NearestEvent style={styles.nearest} />
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100, // espace pour le bouton de profil
  },
  eventsContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  nearest: {
    flex: 1,
    marginVertical: 6,
    paddingHorizontal: 10,
  },
});
