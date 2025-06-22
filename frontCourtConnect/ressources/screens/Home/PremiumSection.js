import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { authFetch } from "../../utils/AuthFetch";
import { useTheme } from "../../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import AuthContext from "../../context/AuthContext";
import Button from "../../shared/Button";
import assets from "../../constants/assets";

export default function PremiumSection({ style }) {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const [favorites, setFavorites] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await authFetch("api/getAllFavoriteTerrains");
        if (res.ok) {
          const data = await res.json();
          setFavorites(data);
        } else {
          console.error("Erreur fetch favorites:", res.status);
        }
      } catch (err) {
        console.error("Erreur fetch favorites:", err);
      }
    };

    if (user?.roles?.includes("ROLE_PREMIUM")) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

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
            onPress={() => navigation.navigate("SubscribeScreen")}
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
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: theme.text }]}>
          Terrains favoris
        </Text>
        <Image
          source={assets.icons.heart_filled}
          style={[styles.heartIcon, {tintColor: theme.text}]}
        />
      </View>


      {favorites.length === 0 ? (
        <Text style={[styles.emptyText, { color: theme.text }]}>
          Aucun terrain favori pour le moment
        </Text>
      ) : (
        <View style={styles.favoritesContainer}>
          {favorites.map((terrain) => (
            <TouchableOpacity
              key={terrain.id}
              style={[styles.favoriteItem, { backgroundColor: theme.background }]}
              onPress={() => navigation.navigate('TerrainDetail', { terrainId: terrain.id })}
            >
              <Text style={[styles.favoriteName, { color: theme.text }]}>
                {terrain.nom}
              </Text>
              <Text style={[styles.favoriteLocation, { color: theme.text }]}>
                {terrain.ville}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
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
  favoritesContainer: {
    gap: 10,
    marginTop: 10,
  },
  favoriteItem: {
    padding: 12,
    borderRadius: 8,
  },
  favoriteName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  favoriteLocation: {
    fontSize: 12,
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 20,
    fontStyle: 'italic',
  },
  heart_filled: {
    width: 24,
    height: 24,
  },
    titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heartIcon: {
    width: 16,
    height: 16,
  },
});
