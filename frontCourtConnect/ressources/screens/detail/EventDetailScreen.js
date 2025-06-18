import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { authFetch } from "../../utils/AuthFetch";
import assets from "../../constants/assets";
import Button from "../../shared/Button";
import PageLayout from "../../shared/PageLayout";
import AuthContext from "../../context/AuthContext";

export default function EventDetailScreen({ route }) {
  const { theme } = useTheme();
  const { user } = useContext(AuthContext);
  const eventId = route.params?.eventId;

  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    const fetchData = async () => {
      try {
        const res = await authFetch(`api/getEvent/${eventId}`);
        const data = await res.json();
        setEvent(data);

        const usersRes = await authFetch(`api/getUsersOfThisEvent/${eventId}`);
        const users = await usersRes.json();

        setParticipants(users);
        setJoined(users.some((u) => u.id === user?.id));
      } catch (err) {
        console.error("Erreur lors du chargement de l'événement :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId, user]);

  const handleJoinOrLeave = async () => {
    try {
      const routeName = joined ? "leaveEvent" : "joinEvent";
      const res = await authFetch(`api/${routeName}/${eventId}`, {
        method: "POST",
      });

      if (res.ok) {
        const updatedUsersRes = await authFetch(
          `api/getUsersOfThisEvent/${eventId}`
        );
        const updatedUsers = await updatedUsersRes.json();
        setParticipants(updatedUsers);
        setJoined(updatedUsers.some((u) => u.id === user?.id));
      } else {
        console.error("Erreur lors de la participation/désinscription");
      }
    } catch (err) {
      console.error("Erreur join/leave:", err);
    }
  };

  const getLevelLabel = (levelValue) => {
    switch (levelValue?.toString()) {
      case "0":
        return "Débutant";
      case "1":
        return "Intermédiaire";
      case "2":
        return "Expert";
      default:
        return "Non précisé";
    }
  };

  const formatDate = (rawDate) => {
    const date = new Date(rawDate);
    return date.toLocaleString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading || !event) {
    return (
      <View style={[styles.container]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <PageLayout>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={{ flex: 1 }}
        >
          <View style={styles.imagePlaceholder} />
          <View style={[styles.header, { backgroundColor: theme.card }]}>
            <View style={styles.headerTop}>
              <Text style={[styles.title, { color: theme.text }]}>
                {event.nom}
              </Text>

              <View style={styles.playersCount}>
                <Text style={{ color: theme.primary, marginRight: 4 }}>
                  {participants.length}/{event.max_joueurs}
                </Text>
                <Image
                  source={assets.icons.person_active}
                  style={{ width: 16, height: 16, tintColor: theme.primary }}
                />
              </View>
            </View>

            <View style={styles.details}>
              <Text style={[styles.label, { color: theme.text }]}>
                Terrain : {event.terrain.nom}, {event.terrain.ville}
              </Text>

              <Text
                style={[
                  styles.label,
                  {
                    color: theme.text,
                    borderBottomWidth: 1,
                    paddingBottom: 8,
                    borderColor: theme.text + "99",
                  },
                ]}
              >
                Date : {formatDate(event.date_heure)}
              </Text>

              <Text style={[styles.label, { color: theme.text }]}>
                Niveau : {getLevelLabel(event.niveau)}
              </Text>

              <Text style={[styles.label, { color: theme.text }]}>
                Type : {event.type_event.nom}
              </Text>

              <Text style={[styles.label, { color: theme.text + "99" }]}>
                Crée par :{" "}
                {event.created_by.prenom + " " + event.created_by.nom ||
                  event.created_by.username}
              </Text>
            </View>
          </View>
          <View style={{ height: 80 }} />
        </ScrollView>

        <View style={styles.buttonWrapper}>
          <Button
            onPress={handleJoinOrLeave}
            title={joined ? "Se désinscrire" : "Rejoindre"}
            {...(joined ? { color: "background_light" } : { color: "primary" })}
          />
        </View>
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  imagePlaceholder: {
    height: 250,
    backgroundColor: "#ccc",
  },
  header: {
    flex: 1,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    flexShrink: 1,
    marginRight: 8,
  },
  playersCount: {
    flexDirection: "row",
    alignItems: "center",
  },
  details: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  buttonWrapper: {
    position: "absolute",
    alignSelf: "center",
    width: "50%",
    bottom: 16,
  },
});
