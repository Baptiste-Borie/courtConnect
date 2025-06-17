import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";

import PageLayout from "../shared/PageLayout";
import useLocation from "../customHooks/useLocation";
import MapBox from "../shared/MapBox";

const MapScreen = ({ navigation }) => {
  const { latitude, longitude, errorMsg } = useLocation();
  const mapRef = useRef(null);
  const [terrainMarkers, setTerrainMarkers] = useState([]);
  const [loadingTerrains, setLoadingTerrains] = useState(true);

  useEffect(() => {
    if (latitude && longitude && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  }, [latitude, longitude]);

  useEffect(() => {
    const fetchTerrains = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(
          "https://courtconnect.alwaysdata.net/getAllValidatedTerrains",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Réponse serveur :", errorText);
          throw new Error(`Erreur serveur ${response.status}`);
        }

        const data = await response.json();

        const markers = data.map((terrain) => ({
          coordinate: {
            latitude: terrain.latitude,
            longitude: terrain.longitude,
          },
          title: terrain.nom,
        }));
        setTerrainMarkers(markers);
      } catch (error) {
        console.error("Erreur de récupération des terrains :", error);
      } finally {
        setLoadingTerrains(false);
      }
    };

    fetchTerrains();
  }, []);

  if (errorMsg) {
    return (
      <View>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  if (!latitude || !longitude) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <PageLayout style={styles.container} showHeader={false}>
      <MapBox
        style={{ flex: 1 }}
        region={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        userLocation={{
          coordinate: { latitude, longitude },
          title: "Vous êtes ici",
        }}
        terrainMarkers={terrainMarkers}
      />
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default MapScreen;
