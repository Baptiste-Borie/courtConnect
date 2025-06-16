import { StyleSheet, View } from "react-native";

import PageLayout from "../../shared/PageLayout";
import AccountScreenHeader from "./AccountScreenHeader";
import AccountScreenMainContent from "./AccountScreenMainContent";

export default function HomeScreen({ navigation, onLogout }) {
  return (
    <PageLayout style={styles.content}>
      <AccountScreenHeader style={styles.header} />
      <AccountScreenMainContent />
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: 20,
    alignItems: "center",
  },
  header: {
    position: "absolute",
    top: 50,
    right: 20,
  },
});
