import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ActivityIndicator, Image } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { authFetch } from "../../utils/AuthFetch";
import assets from "../../constants/assets";

export default function PremiumSection({ style }) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState(null);
  const [loadingEventsIds, setLoadingEventsIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await authFetch("api/getAllEvents");
        const data = await res.json();

        setLoadingEventsIds(data.map((e) => e.id));

        const eventsWithUsers = await Promise.all(
          data.map(async (event) => {
            try {
              const userRes = await authFetch(
                `api/getUsersOfThisEvent/${event.id}`
              );
              const users = await userRes.json();
              return {
                ...event,
                currentPlayers: users.length,
                fillingRate: users.length / event.max_joueurs,
              };
            } catch {
              return {
                ...event,
                currentPlayers: 0,
                fillingRate: 0,
              };
            } finally {
              setLoadingEventsIds((prev) =>
                prev.filter((id) => id !== event.id)
              );
            }
          })
        );

        const sorted = eventsWithUsers.sort(
          (a, b) => b.fillingRate - a.fillingRate
        );

        setEvents(sorted);
      } catch (err) {
        console.error("Erreur récupération events + users :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading && !events) {
    return (
      <View style={[styles.container, style]}>
        <Text style={[styles.title, { color: theme.text }]}>
          Soyez parmi les derniers à rejoindre !!
        </Text>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.title, { color: theme.text }]}>
        Soyez parmi les derniers à rejoindre !!
      </Text>

      {events.slice(0, 4).map((item) => {
        const isLoading = loadingEventsIds.includes(item.id);

        return (
          <View key={item.id} style={styles.eventCard}>
            <View style={styles.iconPlaceholder} />
            <View style={{ flex: 1 }}>
              <Text style={[{ color: theme.text, fontWeight: "bold" }]}>
                {item.nom}
              </Text>
              <Text style={{ color: theme.text + "99", fontSize: 12 }}>
                {item.terrain.nom}
              </Text>
              <Text
                style={{ color: theme.text + "99", fontSize: 12, marginTop: 4 }}
              >
                {item.type_event.nom}
              </Text>
            </View>

            <View style={styles.playersCount}>
              {isLoading ? (
                <ActivityIndicator size="small" color={theme.primary} />
              ) : (
                <>
                  <Text style={{ color: theme.primary, marginRight: 4 }}>
                    {item.currentPlayers}/{item.max_joueurs}
                  </Text>
                  <Image
                    source={assets.icons.person_active}
                    style={{ width: 16, height: 16 }}
                  />
                </>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  eventCard: {
    borderRadius: 8,
    padding: 12,
    paddingLeft: 0,
    marginBottom: 10,
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 6,
    backgroundColor: "#ccc",
  },
  playersCount: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 40,
    justifyContent: "flex-end",
  },
});
