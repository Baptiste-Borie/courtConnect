import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import AuthContext from "../../context/AuthContext";
import Button from "../../shared/Button";

export default function PremiumSection({ style }) {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const [favorites, setFavorites] = useState(null);

  /*   useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await authFetch("api/getFavorites");
        const data = await res.json();
        setFavorites(data);
      } catch (err) {
        console.error("Erreur fetch favorites:", err);
      }
    };
    if (user?.roles.includes("ROLE_PREMIUM")) fetchFavorites();
  }, [user]); */

  if (!user) {
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

  const isPremium = user.roles?.includes("ROLE_PREMIUM");

  if (!isPremium) {
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
            onPress={() => navigation.navigate("Subscribe")}
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
      {/* Affichage des favoris ici  */}
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
