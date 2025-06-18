import React, { forwardRef, useContext, useRef } from "react";
import { View, StyleSheet, Dimensions, Image } from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";

import { ThemeContext } from "../context/ThemeContext";
import assets from "../constants/assets";
import MarkerCourt from "./MarkerCourt";
import { recenterMarker } from '../utils/RecenterOnMarker';

const MapBox = forwardRef(({
  style = {},
  height = 200,
  region,
  centerMaker = false,
  userLocation,
  terrainMarkers = [],
  onRegionChange = () => { },
}, ref) => {
  const { themeName } = useContext(ThemeContext);
  const handlePress = () => {
    recenterMarker(userMarkerRef, ref, userLocation.coordinate);
  };

  const userMarkerRef = useRef(null);


  return (
    <View style={[{ flex: 1 }, { height }, style]}>
      <MapView
        ref={ref}
        style={StyleSheet.absoluteFill}
        userInterfaceStyle={themeName}
        key={
          region?.latitude +
          "-" +
          region?.longitude +
          "-" +
          terrainMarkers
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
            onPress={handlePress}  
            ref={userMarkerRef}
          />
        )}
        {terrainMarkers.map((marker, index) => {
          return (
            <MarkerCourt
              key={index}
              userLocation={userLocation}
              marker={marker}
              mapRef={ref}
            >
            </MarkerCourt>
          );
        })}

      </MapView>

      {centerMaker && (
        <View style={styles.markerFixed}>
          <Image source={assets.icons.marker} style={styles.marker} />
        </View>
      )}
    </View>
  );
});

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
