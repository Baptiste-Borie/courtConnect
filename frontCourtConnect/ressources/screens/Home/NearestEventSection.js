import React, { useState, useContext, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";
import { authFetch } from "../../utils/AuthFetch";
import { getDistance } from "../../utils/GetDistance";
import EventCard from "./EventCard";
import useLocation from "../../customHooks/useLocation";

export default function NearestEventSection({ style, refreshKey }) {
  const { theme } = useTheme();
  const { latitude, longitude, permissionGranted } = useLocation();

  const [loadingEvents, setLoadingEvents] = useState(true);
  const [events, setEvents] = useState([]);

  const fetchTerrains = useCallback(async () => {
    if (!latitude || !longitude) return;

    setLoadingEvents(true);
    try {
      const res = await authFetch("api/getOnGoingEvents");
      const data = await res.json();

      const sorted = data
        .map((e) => ({
          ...e,
          distance: getDistance(
            latitude,
            longitude,
            e.terrain.latitude,
            e.terrain.longitude
          ),
        }))
        .sort((a, b) => a.distance - b.distance);

      setEvents(sorted);
    } catch (err) {
      console.error("Erreur chargement events :", err);
    } finally {
      setLoadingEvents(false);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    fetchTerrains();
  }, [fetchTerrains, refreshKey]);

  useFocusEffect(
    useCallback(() => {
      fetchTerrains();
    }, [fetchTerrains])
  );

  if (!permissionGranted) {
    return (
      <View style={[styles.container, style]}>
        <Text style={[styles.title, { color: theme.text }]}>
          Événements autour de moi
        </Text>
        <Text style={{ color: theme.text + "99" }}>
          Veuillez autoriser l'accès à votre position pour voir les événements
          autour de vous.
        </Text>
      </View>
    );
  }

  if (!latitude || !longitude) {
    return (
      <View style={[styles.container, style]}>
        <Text style={[styles.title, { color: theme.text }]}>
          Chargement de la position...
        </Text>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.title, { color: theme.text }]}>
        Événements autour de moi
      </Text>

      {loadingEvents ? (
        <ActivityIndicator color={theme.primary} />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              distance={event.distance}
              theme={theme}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
