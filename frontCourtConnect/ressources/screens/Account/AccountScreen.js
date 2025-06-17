import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { authFetch } from "../../utils/AuthFetch";
import PageLayout from "../../shared/PageLayout";
import AccountScreenHeader from "./AccountScreenHeader";
import AccountScreenMainContent from "./AccountScreenMainContent";

export default function AccountScreen({ navigation, onLogout }) {
  const [data, setData] = useState(null);
  useFocusEffect(
    React.useCallback(() => {
      const fetchUser = async () => {
        try {
          const res = await authFetch("api/userConnected", {
            method: "GET",
          });

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

  console.log("b:SS", onLogout);

  return (
    <PageLayout style={styles.content} onLogout={onLogout}>
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
