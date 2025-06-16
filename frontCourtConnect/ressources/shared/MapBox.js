import React, { useContext } from "react";
import { View, StyleSheet, Dimensions, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { ThemeContext } from "../context/ThemeContext";

const MapBox = ({
  width: mapWidth = "100%",
  height = 200,
  region,
  centerMaker = false,
  onRegionChange = () => {},
}) => {
  const { themeName } = useContext(ThemeContext);

  return (
    <View style={{ width: mapWidth, height }}>
      <MapView
        style={StyleSheet.absoluteFill}
        userInterfaceStyle={themeName}
        initialRegion={
          region || {
            latitude: 48.8566,
            longitude: 2.3522,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }
        }
        onRegionChangeComplete={onRegionChange}
      />

      {centerMaker && (
        <Marker coordinate={{ latitude, longitude }} title="Vous êtes ici" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  markerFixed: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -12,
    marginTop: -24,
  },
  marker: {
    width: 48,
    height: 48,
  },
});

export default MapBox;
