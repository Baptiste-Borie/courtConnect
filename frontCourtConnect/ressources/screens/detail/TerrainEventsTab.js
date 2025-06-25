import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { authFetch } from "../../utils/AuthFetch";
import assets from "../../constants/assets";
import { getTerrainImageUri } from "../../utils/GetImage";

export default function TerrainEventsTab({ terrainId, theme }) {
  const navigation = useNavigation();

  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingEventsIds, setLoadingEventsIds] = useState([]);
  const [imagesUriMap, setImagesUriMap] = useState({});

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await authFetch(`api/getEventsOfTerrain/${terrainId}`);
        const data = await res.json();

        setLoadingEventsIds(data.map((e) => e.id));


        const imagesMap = {};
        await Promise.all(
          data.map(async (event) => {
            const terrainId = event.terrain.id;
            if (!imagesMap[terrainId]) {
              try {
                const uri = await getTerrainImageUri(terrainId);
                imagesMap[terrainId] = uri;
              } catch (error) {
                console.error("Erreur image terrain:", error);
                imagesMap[terrainId] = null;
              }
            }
          })
        );
        setImagesUriMap(imagesMap);


        const enriched = await Promise.all(
          data.map(async (event) => {
            try {
              const res = await authFetch(`api/getUsersOfThisEvent/${event.id}`);
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
        console.error("Erreur chargement events du terrain :", err);
      } finally {
        setLoading(false);
      }
    };

    if (terrainId) fetchEvents();
  }, [terrainId]);


  if (loading && !events) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  if (!events || events.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.text }]}>
          Aucun événement pour ce terrain
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>
        Événements organisés ici
      </Text>

      {events.map((item) => {
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
            <View style={styles.iconPlaceholder} >
              {imagesUriMap[item?.terrain?.id] ? (
                <Image
                  source={{ uri: imagesUriMap[item.terrain.id] }}
                  style={styles.image}
                />
              ) : null}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[{ color: theme.text, fontWeight: "bold" }]}>
                {item.nom}
              </Text>
              <Text style={{ color: theme.text + "99", fontSize: 12 }}>
                {item?.terrain.nom}
              </Text>
              <Text
                style={{ color: theme.text + "99", fontSize: 12, marginTop: 4 }}
              >
                {item?.type_event.nom}
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
          </TouchableOpacity>
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
    marginBottom: 4,
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
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
  },

});
