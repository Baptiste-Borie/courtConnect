import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import { ThemeContext } from "../context/ThemeContext";
import AuthContext from "../context/AuthContext";
import WaitingCourt from "../shared/WaitingCourt";
import PageLayout from "../shared/PageLayout";
import TrustabilityGauge from "../shared/TrustabilityGauge";

export default function WaitingCourtsScreen() {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  console.log("b:", user);

  const isUserTrusted =
    user?.roles?.includes("ROLE_TRUSTED") ||
    user?.roles?.includes("ROLE_PREMIUM");

  return (
    <PageLayout headerContent={"Terrains en attente"}>
      <ScrollView>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          {!isUserTrusted && (
            <View>
              <Text style={[styles.title, { color: theme.text }]}>
                Vous devez être un utilisateur de confiance pour voir les
                terrains en attente.
              </Text>

              <Text style={{ color: theme.text }}>
                Pour devenir un utilisateur de confiance, vous devez participer
                ou rejoindre des événements.
              </Text>
              <Text style={{ color: theme.text, marginVertical: 16 }}>
                Participer à des événements rapporte 5 points. Créer un
                événement rapporte 10 points (ou 5 si vous n'y participez pas).
              </Text>
              <Text style={{ color: theme.text, marginVertical: 16 }}>
                Vous pouvez aussi devenir un utilisateur de confiance en
                souscrivant à l'abonnement premium.
              </Text>

              <TrustabilityGauge value={user?.trustability ?? 0} />
            </View>
          )}
        </View>
      </ScrollView>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
