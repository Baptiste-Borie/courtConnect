import React, { useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { authFetch } from "../../utils/AuthFetch";
import assets from "../../constants/assets";
import { ThemeContext } from "../../context/ThemeContext";
import PageLayout from "../../shared/PageLayout";
import AuthContext from "../../context/AuthContext";

export default function MyEventsScreen() {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingEventsIds, setLoadingEventsIds] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchEvents = async () => {
        setLoading(true);
        try {
          const res = await authFetch(`api/getJoinedEvents`);
          const data = await res.json();

          setLoadingEventsIds(data.map((e) => e.id));

          const enriched = await Promise.all(
            data.map(async (event) => {
              try {
                const res = await authFetch(
                  `api/getUsersOfThisEvent/${event.id}`
                );
                const users = await res.json();
                return {
                  ...event,
                  currentPlayers: users.length,
                };
              } catch {
                return {
                  ...event,
                  currentPlayers: 0,
                };
              } finally {
                setLoadingEventsIds((prev) =>
                  prev.filter((id) => id !== event.id)
                );
              }
            })
          );

          setEvents(enriched);
        } catch (err) {
          console.error("Erreur chargement événements rejoints :", err);
        } finally {
          setLoading(false);
        }
      };

      fetchEvents();
    }, [])
  );

  return (
    <PageLayout headerContent={"Mes événements"}>
      <View style={styles.container}>
        {loading && (
          <ActivityIndicator
            size="large"
            color={theme.primary}
            style={{ marginTop: 20 }}
          />
        )}

        {!loading && (!events || events.length === 0) && (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.text }]}>
              Aucun événement rejoint
            </Text>
          </View>
        )}

        {!loading &&
          events?.map((item) => {
            const isLoading = loadingEventsIds.includes(item.id);

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() =>
                  navigation.navigate("EventDetail", { eventId: item.id })
                }
                style={[
                  styles.eventCard,
                  { backgroundColor: theme.background_light },
                ]}
                activeOpacity={0.8}
              >
                <View style={styles.iconPlaceholder} />
                <View style={{ flex: 1 }}>
                  <Text style={[{ color: theme.text, fontWeight: "bold" }]}>
                    {item.nom ?? "Nom inconnu"}
                  </Text>
                  <Text style={{ color: theme.text + "99", fontSize: 12 }}>
                    {item.terrain?.nom ?? "Terrain inconnu"}
                  </Text>
                  <Text
                    style={{
                      color: theme.text + "99",
                      fontSize: 12,
                      marginTop: 4,
                    }}
                  >
                    {item.type_event?.nom ?? "Type d’événement inconnu"}
                  </Text>
                </View>

                <View style={styles.playersCount}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color={theme.primary} />
                  ) : (
                    <>
                      <Text style={{ color: theme.primary, marginRight: 4 }}>
                        {item.currentPlayers ?? 0}/{item.max_joueurs ?? 0}
                      </Text>
                      <Image
                        source={assets.icons.person_active}
                        style={{ width: 16, height: 16 }}
                      />
                    </>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}

      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    gap: 8,
    flex: 1,
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
