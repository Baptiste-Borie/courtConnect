import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import assets from "../constants/assets";
import { useTheme } from "../context/ThemeContext";
import { authFetch } from "../utils/AuthFetch";
import AuthContext from "../context/AuthContext";

export default function AddModal({ visible, onClose, onAddTerrain, onAddEvent }) {

  const { theme } = useTheme();
  const { user } = useContext(AuthContext);

  const [terrainCount, setTerrainCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);

  let MAX_TERRAINS = null;
  let MAX_EVENTS = null;

  if (user?.roles?.includes("ROLE_PREMIUM")) {
    MAX_TERRAINS = null;
    MAX_EVENTS = null;
  } else if (user?.roles?.includes("ROLE_TRUSTED")) {
    MAX_TERRAINS = null;
    MAX_EVENTS = 30;
  } else {
    MAX_TERRAINS = 1;
    MAX_EVENTS = 10;
  }


  useEffect(() => {
    if (!visible) return;

    const fetchCounts = async () => {
      try {
        const resTerrains = await authFetch("api/getTerrainCreatedByUser");
        const terrains = await resTerrains.json();
        setTerrainCount(typeof terrains === "number" ? terrains : 0);

        const resEvents = await authFetch("api/getEventCreatedByUser");
        const events = await resEvents.json();
        setEventCount(typeof events === "number" ? events : 0);
      } catch (err) {
        console.error("Erreur récupération compteurs :", err);
        setTerrainCount(0);
        setEventCount(0);
      }
    };
    fetchCounts();
  }, [visible]);

  const isTerrainLimitReached = MAX_TERRAINS !== null && terrainCount >= MAX_TERRAINS;
  const isEventLimitReached = MAX_EVENTS !== null && eventCount >= MAX_EVENTS;
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={[styles.container, { backgroundColor: theme.background_light }]}>
        <Text style={[styles.title, { color: theme.text }]}>
          Ajouter un terrain ou un événement
        </Text>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.button, isTerrainLimitReached && { opacity: 0.5 }]}
            onPress={() => {
              if (!isTerrainLimitReached) onAddTerrain();
            }}
          >
            <Image source={assets.terrain} style={styles.image} />
            <Text style={[styles.label, { color: theme.text }]}>
              Ajouter un terrain
            </Text>
            {MAX_TERRAINS !== null && (
              <Text style={{ fontSize: 10, color: theme.text + "99", textAlign: "center" }}>
                ({terrainCount}/{MAX_TERRAINS})
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, isEventLimitReached && { opacity: 0.5 }]}
            onPress={() => {
              if (!isEventLimitReached) onAddEvent();
            }}
          >
            <Image source={assets.ballon} style={styles.image} />
            <Text style={[styles.label, { color: theme.text }]}>
              Ajouter un événement
            </Text>
            {MAX_EVENTS !== null && (
              <Text style={{ fontSize: 10, color: theme.text + "99", textAlign: "center" }}>
                ({eventCount}/{MAX_EVENTS})
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    height: 250,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    gap: 36,
    width: "100%",
  },

  button: {
    width: 120,
    alignItems: "center",
  },

  image: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },

  label: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
});
