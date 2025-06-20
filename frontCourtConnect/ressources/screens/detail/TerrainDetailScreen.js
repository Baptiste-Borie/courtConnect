import React, { useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { authFetch } from "../../utils/AuthFetch";
import PageLayout from "../../shared/PageLayout";
import TerrainDetailTab from "./TerrainDetailTab";
import TerrainEventsTab from "./TerrainEventsTab";
import AuthContext from "../../context/AuthContext";
import { getTerrainImageUri } from "../../utils/GetImage";

export default function TerrainDetailScreen({ route }) {
  const { theme } = useTheme();
  const { user } = useContext(AuthContext);
  const [isFavorite, setIsFavorite] = useState(null);
  const terrainId = route.params?.terrainId;
  const [terrain, setTerrain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [imageUri, setImageUri] = useState(null);


  const navigation = useNavigation();
  const toggleFavorite = async () => {
    if (!user?.roles?.includes("ROLE_PREMIUM")) {
      Alert.alert(
        "Fonctionnalité Premium",
        "Ajoutez ce terrain à vos favoris en devenant membre Premium.",
        [
          {
            text: "S'abonner",
            onPress: () => navigation.navigate("SubscribeScreen"),
          },
          { text: "Annuler", style: "cancel" },
        ]
      );
      return;
    }

    try {
      const route = isFavorite
        ? `api/deleteTerrainFromFavorite/${terrainId}`
        : `api/addTerrainToFavorite/${terrainId}`;

      const res = await authFetch(route, { method: "POST" });
      if (res.ok) {
        setIsFavorite(!isFavorite);
        Alert.alert(
          "Favoris mis à jour",
          isFavorite
            ? "Le terrain a été retiré de vos favoris."
            : "Le terrain a été ajouté à vos favoris."
        );
      } else {
        Alert.alert("Erreur", "Une erreur est survenue côté serveur.");
      }
    } catch (err) {
      console.error("Erreur favori :", err);
      Alert.alert("Erreur", "Impossible de modifier les favoris.");
    }
  };


  useEffect(() => {
    const checkIfFavorite = async () => {

      if (!user?.roles?.includes("ROLE_PREMIUM")) {
        setIsFavorite(false);
        return;
      }
      try {
        const res = await authFetch('/api/getAllFavoriteTerrains');
        if (res.ok) {
          const favorites = await res.json();
          const isTerrainFavorite = favorites.some(
            (fav) => fav.id === terrainId
          );
          setIsFavorite(isTerrainFavorite);
        } else {
          console.error("Erreur lors de la récupération des favoris");
        }
      } catch (err) {
        console.error("Erreur favori :", err);
      }
    };

    if (terrainId && user?.id) {
      checkIfFavorite();
    } else {
      setIsFavorite(false);
    }
  }, [terrainId, user?.id]);



  useEffect(() => {
    const fetchTerrain = async () => {
      try {
        const res = await authFetch(`api/getTerrain/${terrainId}`);
        const data = await res.json();
        setTerrain(data);

        const image = await getTerrainImageUri(terrainId);
        setImageUri(image);
      } catch (err) {
        console.error("Erreur chargement terrain :", err);
      } finally {
        setLoading(false);
      }
    };

    if (terrainId) fetchTerrain();
  }, [terrainId]);

  if (loading || !terrain) {
    return (
      <View style={[styles.container]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const isOwner = user?.id === terrain?.created_by?.id;
  return (
    <PageLayout
      more={isOwner ? ["modify"] : []}
      editMode={isOwner ? { type: "terrain", data: terrain } : null}
    >
      <ScrollView>
        <Image
          source={{ uri: imageUri }}
          style={{ height: 250, width: "100%" }}
          resizeMode="cover"
        />

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "details" && {
                borderBottomColor: theme.primary,
                borderBottomWidth: 2,
              },
            ]}
            onPress={() => setActiveTab("details")}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === "details" ? theme.primary : theme.text },
              ]}
            >
              Détail
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "events" && {
                borderBottomColor: theme.primary,
                borderBottomWidth: 2,
              },
            ]}
            onPress={() => setActiveTab("events")}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === "events" ? theme.primary : theme.text },
              ]}
            >
              Événements
            </Text>
          </TouchableOpacity>
        </View>
        {activeTab === "details" ? (
          <TerrainDetailTab terrain={terrain} theme={theme} isFavorite={isFavorite} toggleFavorite={toggleFavorite} user={user} />
        ) : (
          <TerrainEventsTab terrainId={terrain.id} theme={theme} />
        )}
      </ScrollView>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholder: {
    height: 250,
    backgroundColor: "#ccc",
  },
  card: {
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  starIcon: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
    width: 100,
  },
  value: {
    flex: 1,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 16,
    justifyContent: "space-between",
  },
  detailItem: {
    width: "48%",
    marginBottom: 12,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
