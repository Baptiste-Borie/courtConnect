import React, { useContext } from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import { ThemeContext } from "../../context/ThemeContext";
import PageLayout from "../../shared/PageLayout";
const AccountSettings = () => {
  const { theme, toggleTheme, themeName } = useContext(ThemeContext);

  return (
    <PageLayout
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.settingRow}>
        <Text style={[styles.label, { color: theme.text }]}>Mode sombre</Text>
        <Switch
          value={themeName === "dark"}
          onValueChange={toggleTheme}
          trackColor={{ true: theme.primary }}
          thumbColor={themeName === "dark" ? "#fff" : "#fff"}
        />
      </View>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default AccountSettings;
