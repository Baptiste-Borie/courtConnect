import { useEffect, useRef } from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import PageLayout from "../shared/PageLayout";
import useLocation from "../customHooks/useLocation";
import MapBox from "../shared/MapBox";

const MapScreen = ({ navigation }) => {
  const { latitude, longitude, errorMsg } = useLocation();
  const mapRef = useRef(null);

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
        markers={[
          {
            coordinate: { latitude, longitude },
            title: "Vous êtes ici",
          },
        ]}
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
