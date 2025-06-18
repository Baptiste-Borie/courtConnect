import React, { useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { authFetch } from "../../utils/AuthFetch";
import { getDistance } from "../../utils/GetDistance";
import EventCard from "./EventCard";
import useLocation from "../../customHooks/useLocation";

export default function NearestEventSection({ style }) {
  const { theme } = useTheme();
  const { latitude, longitude } = useLocation();

  const [loadingEvents, setLoadingEvents] = useState(true);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!latitude || !longitude) return;

    const fetchTerrains = async () => {
      try {
        const res = await authFetch("api/getAllEvents");
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
