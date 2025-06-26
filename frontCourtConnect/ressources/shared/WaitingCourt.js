import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../context/ThemeContext";
import { authFetch } from "../utils/AuthFetch";
import { getTerrainImageUri } from "../utils/GetImage";
import ValidationCourtsTab from "./ValidationCourtsTab";
import SuppressionCourtsTab from "./SuppressionCourtsTab";

export default function WaitingCourtScreen({ style }) {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [courts, setCourts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [imagesUriMap, setImagesUriMap] = useState({});
  const [activeTab, setActiveTab] = useState("validation");

  const handleValidation = async (terrainId, action) => {
    try {
      await authFetch(`/api/terrain/${terrainId}/${action}`, {
        method: "POST",
      });
      setRefresh((prev) => !prev);
    } catch (err) {
      console.error(
        `Erreur lors de la ${action} du terrain ${terrainId} :`,
        err
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchCourts = async () => {
        try {
          setLoading(true);
          const res = await authFetch("/api/getAllNoVotedTerrains");
          const data = await res.json();
          if (isActive) {
            setCourts(data);
            const imagesMap = {};
            await Promise.all(
              data.map(async (terrain) => {
                try {
                  const uri = await getTerrainImageUri(terrain.id);
                  imagesMap[terrain.id] = uri;
                } catch (error) {
                  console.error("Error loading terrain image:", error);
                  imagesMap[terrain.id] = null;
                }
              })
            );
            setImagesUriMap(imagesMap);
          }
        } catch (err) {
          console.error("Erreur récupération terrains :", err);
        } finally {
          if (isActive) setLoading(false);
        }
      };
      fetchCourts();
      return () => {
        isActive = false;
      };
    }, [refresh])
  );

  if (loading) {
    return (
      <View style={[styles.container, style]}>
        <Text style={[styles.title, { color: theme.text }]}>
          Chargement des terrains en attente...
        </Text>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  if (courts.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <Text style={[styles.title, { color: theme.text }]}>
          Aucun terrain en attente de validation pour le moment.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, style]}>
      <Text style={[styles.title, { color: theme.text }]}>
        Terrains en attente ({courts.length})
      </Text>
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setActiveTab("validation")}>
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === "validation" ? theme.primary : theme.text,
              },
            ]}
          >
            Validation
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("suppression")}>
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === "suppression" ? theme.primary : theme.text,
              },
            ]}
          >
            Suppression
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "validation" ? (
        <ValidationCourtsTab
          courts={courts}
          imagesUriMap={imagesUriMap}
          onValidate={handleValidation}
        />
      ) : (
        <SuppressionCourtsTab
          courts={courts}
          imagesUriMap={imagesUriMap}
          onValidate={handleValidation}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 12,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
