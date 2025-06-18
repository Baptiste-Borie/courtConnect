import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { authFetch } from "../../utils/AuthFetch";
import Button from "../../shared/Button";
import { useNavigation } from "@react-navigation/native";

export default function PremiumSection({ style }) {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState(null);
  const [premiumUser, setPremiumUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPremium = async () => {
      try {
        const res = await authFetch("api/userConnected");
        const data = await res.json();
        setPremiumUser(data.roles.includes("ROLE_PREMIUM"));
      } catch (err) {
        console.error("Erreur fetch userConnected:", err);
      } finally {
        setLoading(false);
      }
    };

    checkPremium();
  }, []);

  if (loading) {
    return (
      <View
        style={[styles.container, style, { backgroundColor: theme.primary }]}
      >
        <Text style={[styles.title, { color: theme.text }]}>
          Chargement des terrains favoris...
        </Text>
        <ActivityIndicator color={theme.background} />
      </View>
    );
  }

  if (!premiumUser) {
    return (
      <View
        style={[styles.container, style, { backgroundColor: theme.primary }]}
      >
        <Text style={[styles.title, { color: theme.text }]}>
          Terrains favoris
        </Text>
        <View style={{ alignItems: "center", marginVertical: 20 }}>
          <Text style={[styles.promoText, { color: theme.background }]}>
            Souscrivez à l’offre premium !!
          </Text>
          <Button
            title="2.99€/mois"
            color="background"
            style={{ width: "50%", marginTop: 20 }}
            onPress={() => navigation.navigate("Premium")}
          />
        </View>
      </View>
    );
  }

  if (!favorites) {
    return (
      <View
        style={[styles.container, style, { backgroundColor: theme.primary }]}
      >
        <Text style={[styles.title, { color: theme.text }]}>
          Terrains favoris
        </Text>
        <ActivityIndicator color={theme.background} />
      </View>
    );
  }

  return (
    <View style={[styles.container, style, { backgroundColor: theme.primary }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        Terrains favoris
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    padding: 12,
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  promoText: {
    fontSize: 15,
    fontWeight: "600",
    marginVertical: 8,
  },
});
