import { useEffect, useRef, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Alert } from "react-native";

import PageLayout from "../shared/PageLayout";
import useLocation from "../customHooks/useLocation";
import MapBox from "../shared/MapBox";
import RecenterButton from "../shared/RecenterButton";
import { authFetch } from "../utils/AuthFetch";

const DEFAULT_PARIS_COORDS = {
  latitude: 48.8566,
  longitude: 2.3522,
};

const MapScreen = ({ navigation }) => {
  const { latitude, longitude, errorMsg, permissionGranted } = useLocation();
  const mapRef = useRef(null);

  const [terrainMarkers, setTerrainMarkers] = useState([]);
  const [loadingTerrains, setLoadingTerrains] = useState(true);
  const [alertShown, setAlertShown] = useState(false);

  const mapLatitude = permissionGranted
    ? latitude
    : DEFAULT_PARIS_COORDS.latitude;
  const mapLongitude = permissionGranted
    ? longitude
    : DEFAULT_PARIS_COORDS.longitude;

  useEffect(() => {
    if (mapLatitude && mapLongitude && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: mapLatitude,
          longitude: mapLongitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  }, [mapLatitude, mapLongitude]);

  useEffect(() => {
    if (!permissionGranted && !alertShown) {
      Alert.alert(
        "Localisation refusée",
        "Vous avez refusé l'accès à la localisation. Certaines fonctionnalités seront limitées.",
        [{ text: "OK" }]
      );
      setAlertShown(true);
    }
  }, [permissionGranted]);

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
          id: terrain.id,
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

  if ((!latitude || !longitude) && permissionGranted && loadingTerrains) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <PageLayout style={styles.container} showHeader={false}>
      <MapBox
        style={{ flex: 1 }}
        ref={mapRef}
        region={{
          latitude: mapLatitude,
          longitude: mapLongitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        userLocation={
          permissionGranted
            ? {
                coordinate: { latitude, longitude },
                title: "Vous êtes ici",
              }
            : null
        }
        terrainMarkers={terrainMarkers}
      />
      {permissionGranted && (
        <RecenterButton
          mapRef={mapRef}
          latitude={latitude}
          longitude={longitude}
        />
      )}
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
