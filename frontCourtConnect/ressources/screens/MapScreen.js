import { useEffect, useRef, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";

import PageLayout from "../shared/PageLayout";
import useLocation from "../customHooks/useLocation";
import MapBox from "../shared/MapBox";
import RecenterButton from "../shared/RecenterButton";
import { authFetch } from "../utils/AuthFetch";

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
        const response = await authFetch("getAllValidatedTerrains");

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
        ref={mapRef}
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
      <RecenterButton
        mapRef={mapRef}
        latitude={latitude}
        longitude={longitude}
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
