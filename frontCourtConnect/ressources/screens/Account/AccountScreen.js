import { StyleSheet, View } from "react-native";

import OrangeButton from "../../shared/OrangeButton";
import PageLayout from "../../shared/PageLayout";
import AccountScreenHeader from "./AccountScreenHeader";

export default function HomeScreen({ navigation, onLogout }) {
  return (
    <PageLayout style={styles.content}>
      <AccountScreenHeader style={styles.header} />
      <OrangeButton title="Accc" onPress={() => navigation.navigate("Map")} />
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
