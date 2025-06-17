import React, { useContext } from "react";
import { View, StyleSheet, Dimensions, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";

import { ThemeContext } from "../context/ThemeContext";
import assets from "../constants/assets";
import MarkerCourt from "./MarkerCourt";

const MapBox = ({
  style = {},
  height = 200,
  region,
  centerMaker = false,
  userLocation ,
  terrainMarkers = [], 
  onRegionChange = () => {},
}) => {
  console.log("Marker de la position:"+ JSON.stringify(userLocation, null, 2))
  console.log("Markers des terrains:"+ JSON.stringify(terrainMarkers, null, 2))

  const { themeName } = useContext(ThemeContext);

  return (
    <View style={[{ flex: 1 }, { height }, style]}>
      <MapView
        style={StyleSheet.absoluteFill}
        userInterfaceStyle={themeName}
        key={
          region?.latitude +
          "-" +
          region?.longitude +
          "-" +
          markers
            .map((m) => m.coordinate.latitude + "," + m.coordinate.longitude)
            .join("|")
        }
        region={
          region || {
            latitude: 48.8566,
            longitude: 2.3522,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }
        }
        onRegionChangeComplete={onRegionChange}
      >
        {userLocation && (
          <Marker
            coordinate={userLocation.coordinate}
            title={userLocation.title}
            pinColor="blue"
          />
        )}
        {terrainMarkers.map((marker, index) => (
          <MarkerCourt
            key={index}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
          />))}
      </MapView>

      {centerMaker && (
        <View style={styles.markerFixed}>
          <Image source={assets.icons.marker} style={styles.marker} />
        </View>
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
