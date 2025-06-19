import React, { useContext, useEffect, useState } from "react";
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

  const terrainId = route.params?.terrainId;
  const [terrain, setTerrain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  const [imageUri, setImageUri] = useState(null);

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
    <PageLayout editMode={isOwner ? { type: "terrain", data: terrain } : null}>
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
          <TerrainDetailTab terrain={terrain} theme={theme} />
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
