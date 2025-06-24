import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../context/ThemeContext";
import { authFetch } from "../utils/AuthFetch";

export default function WaitingCourtScreen({ style }) {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [courts, setCourts] = useState([]);
  const [refresh, setRefresh] = useState(false);

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
          }
        } catch (err) {
          console.error("Erreur récupération terrains :", err);
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      };

      fetchCourts();

      return () => {
        isActive = false; // Pour éviter un setState après un unmount
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
    <View style={[styles.container, style]}>
      <Text style={[styles.title, { color: theme.text }]}>
        Terrains en attente de validation ({courts.length})
      </Text>
      {courts.map((terrain) => (
        <TouchableOpacity
          key={`terrain-${terrain.id}`}
          onPress={() =>
            navigation.navigate("TerrainDetail", { terrainId: terrain.id })
          }
        >
          <View
            style={[
              styles.card,
              {
                backgroundColor:
                  terrain.etat_delete === 0
                    ? "#e74c3c"
                    : theme.background_light,
              },
            ]}
          >
            <View style={styles.headerRow}>
              <Text style={[styles.name, { color: theme.text }]}>
                {terrain.nom}
              </Text>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleValidation(terrain.id, "validate");
                  }}
                >
                  <Text style={{ color: "green", fontSize: 18 }}>✓</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleValidation(terrain.id, "refuse");
                  }}
                >
                  <Text style={{ color: "red", fontSize: 18 }}>✗</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={[styles.info, { color: theme.text + "99" }]}>
              {terrain.adresse || "Adresse inconnue"}
            </Text>
            {terrain.created_by && (
              <View style={{ alignItems: "flex-end" }}>
                <Text style={[styles.info, { color: theme.text + "99" }]}>
                  Ajouté par :{" "}
                  {terrain.created_by.prenom && terrain.created_by.nom
                    ? `${terrain.created_by.prenom} ${terrain.created_by.nom}`
                    : "Inconnu"}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  card: {
    padding: 12,
    borderRadius: 8,
    elevation: 2,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  info: {
    fontSize: 12,
    marginTop: 4,
    justifyContent: "flex-end",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
});
