import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { authFetch } from "../../utils/AuthFetch";
import { getTerrainImageUri } from "../../utils/GetImage";
import assets from "../../constants/assets";

export default function AlmostFullEvents({ style, refreshKey }) {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState(null);
  const [loadingEventsIds, setLoadingEventsIds] = useState([]);
  const [imagesUriMap, setImagesUriMap] = useState({});

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await authFetch("api/getOnGoingEvents");
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
            setLoadingEventsIds((prev) => prev.filter((id) => id !== event.id));
          }
        })
      );

      const sorted = eventsWithUsers.sort(
        (a, b) => b.fillingRate - a.fillingRate
      );

      setEvents(sorted);

      const imagesMap = {};
      await Promise.all(
        sorted.map(async (event) => {
          const uri = await getTerrainImageUri(event?.terrain?.id);
          imagesMap[event?.id] = uri;
        })
      );
      setImagesUriMap(imagesMap);
    } catch (err) {
      console.error("Erreur récupération events + users :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

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

      {events.slice(0,20).map((item) => {
        const isLoading = loadingEventsIds.includes(item.id);
        const imageUri = imagesUriMap[item.id];

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
            <Image
              source={{ uri: imageUri }}
              style={{ height: 80, width: 80 }}
              resizeMode="cover"
            />

            <View style={{ flex: 1 }}>
              <Text style={[{ color: theme.text, fontWeight: "bold" }]}>
                {item.nom}
              </Text>
              <Text style={{ color: theme.text + "99", fontSize: 12 }}>
                {item?.terrain?.nom}
              </Text>
              <Text
                style={{ color: theme.text + "99", fontSize: 12, marginTop: 4 }}
              >
                {item?.type_event?.nom}
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
  playersCount: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 40,
    justifyContent: "flex-end",
  },
});
