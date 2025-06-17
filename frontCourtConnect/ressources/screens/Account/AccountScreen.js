import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import PageLayout from "../../shared/PageLayout";
import AccountScreenHeader from "./AccountScreenHeader";
import AccountScreenMainContent from "./AccountScreenMainContent";

export default function AccountScreen({ navigation }) {
  const [data, setData] = useState(null);
  useFocusEffect(
    React.useCallback(() => {
      const fetchUser = async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          const res = await fetch(
            "https://courtconnect.alwaysdata.net/api/userConnected",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!res.ok) {
            const errText = await res.text();
            console.error("Erreur API userConnected :", errText);
            return;
          }

          const user = await res.json();
          setData(user);
        } catch (err) {
          console.error("Erreur fetch userConnected :", err);
        }
      };

      fetchUser();
    }, [])
  );

  return (
    <PageLayout style={styles.content}>
      <AccountScreenHeader style={styles.header} data={data} />
      <AccountScreenMainContent data={data} />
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
