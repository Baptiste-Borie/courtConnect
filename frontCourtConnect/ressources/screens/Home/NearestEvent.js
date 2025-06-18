import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { authFetch } from "../../utils/AuthFetch";
import EventCard from "./EventCard";
import useLocation from "../../customHooks/useLocation";

export default function NearestEvent({ style }) {
  const { theme } = useTheme();
  const { latitude, longitude } = useLocation();

  const [loadingEvents, setLoadingEvents] = useState(true);
  const [events, setEvents] = useState([]);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const addFakeCoords = (events) => {
    const knownCoords = {
      "Terrain Central": { latitude: 48.8566, longitude: 2.3522 },
      "Terrain du parc": { latitude: 48.8584, longitude: 2.2945 },
      "Salle 308": { latitude: 48.8464111, longitude: 2.3548461 },
    };

    return events.map((event) => {
      const coords = knownCoords[event.terrain.nom.trim()] || {
        latitude: 48.85 + Math.random() * 0.02,
        longitude: 2.34 + Math.random() * 0.02,
      };
      return {
        ...event,
        terrain: { ...event.terrain, ...coords },
      };
    });
  };

  useEffect(() => {
    if (!latitude || !longitude) return;

    const fetchTerrains = async () => {
      try {
        const res = await authFetch("api/getAllEvents");
        const raw = await res.json();
        const data = addFakeCoords(raw);
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
    };

    fetchTerrains();
  }, [latitude, longitude]);

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
              onPress={() => {}}
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
