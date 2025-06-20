import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, ScrollView, Alert, RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import PageLayout from "../../shared/PageLayout";
import ProfileButton from "../../shared/ProfileButton";
import { ThemeContext } from "../../context/ThemeContext";
import NearestEventSection from "./NearestEventSection";
import PremiumSection from "./PremiumSection";
import AlmostFullEvent from "./AlmostFullEvent";
import { authFetch } from "../../utils/AuthFetch";
import AuthContext from "../../context/AuthContext";

const CANCELLED_ALERTS_KEY = "cancelledEventAlerts";

export default function HomeScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // pour forcer le refresh des enfants

  const handleRefresh = () => {
    setRefreshing(true);
    setRefreshKey((prev) => prev + 1);
    setTimeout(() => setRefreshing(false), 1000); // simule une attente
  };

  useEffect(() => {
    const checkCancelledEventsForUser = async () => {
      try {
        const eventsRes = await authFetch("/api/getAllEvents");
        const events = await eventsRes.json();

        const cancelledEvents = events.filter((e) => e.etat === 3);
        const stored = await AsyncStorage.getItem(CANCELLED_ALERTS_KEY);
        const alreadyAlerted = stored ? JSON.parse(stored) : [];

        for (const event of cancelledEvents) {
          const uniqueKey = `event_${event.id}`;
          if (alreadyAlerted.includes(uniqueKey)) continue;

          const usersRes = await authFetch(
            `/api/getUsersOfThisEvent/${event.id}`
          );
          const participants = await usersRes.json();

          const isParticipant = participants.some((p) => p.id === user?.id);

          const date = new Date(event.date_heure);
          const dateWithOffset = new Date(date.getTime() + 2 * 60 * 60 * 1000);

          if (isParticipant) {
            Alert.alert(
              "Événement annulé",
              `L’événement "${
                event.nom
              }" prévu le ${dateWithOffset.toLocaleString("fr-FR", {
                day: "numeric",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
              })} a été annulé.`
            );

            await AsyncStorage.setItem(
              CANCELLED_ALERTS_KEY,
              JSON.stringify([...alreadyAlerted, uniqueKey])
            );
          }
        }
      } catch (err) {
        console.error("Erreur checkCancelledEventsForUser :", err);
      }
    };

    if (user?.id) {
      checkCancelledEventsForUser();
    }
  }, [user?.id]);

  return (
    <PageLayout
      style={[styles.content, { backgroundColor: theme.background }]}
      showHeader={false}
    >
      <ProfileButton style={{ position: "absolute", top: 50, right: 20 }} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
      >
        <NearestEventSection style={styles.section} refreshKey={refreshKey} />
        <PremiumSection style={styles.section} refreshKey={refreshKey} />
        <AlmostFullEvent style={[styles.section]} refreshKey={refreshKey} />
      </ScrollView>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: 100,
  },
  scroll: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    paddingBottom: 80,
    gap: 20,
  },
  section: {
    marginHorizontal: 10,
  },
});
