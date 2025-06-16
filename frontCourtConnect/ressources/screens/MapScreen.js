import { useEffect, useRef } from "react";
import MapView, { Marker } from 'react-native-maps';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import PageLayout from "../shared/PageLayout";
import useLocation from "../customHooks/useLocation";


const MapScreen = ({ navigation }) => {

  const { latitude, longitude, errorMsg } = useLocation();
  const mapRef = useRef(null);
  useEffect(() => {
    if (latitude && longitude && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  }, [latitude, longitude]);

  if (errorMsg) {
    return <View><Text>{errorMsg}</Text></View>;
  }

  if (!latitude || !longitude) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <PageLayout style={styles.container} showHeader={false}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
      >
        <Marker coordinate={{ latitude, longitude }} title="Vous êtes ici" />
      </MapView>
    </PageLayout>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});

export default MapScreen;
