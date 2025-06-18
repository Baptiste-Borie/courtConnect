import { StyleSheet, View, ScrollView } from "react-native";
import { useContext } from "react";

import PageLayout from "../../shared/PageLayout";
import ProfileButton from "../../shared/ProfileButton";
import { ThemeContext } from "../../context/ThemeContext";
import NearestEventSection from "./NearestEventSection";
import PremiumSection from "./PremiumSection";
import AlmostFullEvent from "./AlmostFullEvent";

export default function HomeScreen({ navigation, onLogout }) {
  const { theme } = useContext(ThemeContext);

  return (
    <PageLayout
      style={[styles.content, { backgroundColor: theme.background }]}
      showHeader={false}
    >
      <ProfileButton style={{ position: "absolute", top: 50, right: 20 }} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <NearestEventSection style={styles.section} />
        <PremiumSection style={styles.section} />
        <AlmostFullEvent style={[styles.section]} />
      </ScrollView>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: 100,
  },
  scroll: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    paddingBottom: 80,
    gap: 20,
  },
  section: {
    marginHorizontal: 10,
  },
});
