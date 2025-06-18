import React, { useState, useContext } from "react";
import { StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { authFetch } from "../../utils/AuthFetch";
import PageLayout from "../../shared/PageLayout";
import AccountScreenHeader from "./AccountScreenHeader";
import AccountScreenMainContent from "./AccountScreenMainContent";
import AuthContext from "../../context/AuthContext";

export default function AccountScreen({ navigation, onLogout }) {
  const { user } = useContext(AuthContext);

  return (
    <PageLayout style={styles.content} onLogout={onLogout}>
      <AccountScreenHeader style={styles.header} data={user} />
      <AccountScreenMainContent data={user} />
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
