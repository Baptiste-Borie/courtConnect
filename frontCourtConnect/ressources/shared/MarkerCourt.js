import React from "react";
import { Marker } from "react-native-maps";
import { View, Text, StyleSheet, Image } from "react-native";
import assets from "../constants/assets"; 

const MarkerCourt = ({ coordinate, title, description }) => {
  return (
    <Marker coordinate={coordinate} title={title} description={description}>
      <View style={styles.markerContainer}>
          <Image source={assets.icons.ballon} style={styles.markerIcon} />
        <Text style={styles.label}>{title}</Text>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: "center",
  },
  markerIcon: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    backgroundColor: "white",
    paddingHorizontal: 4,
    borderRadius: 4,
    overflow: "hidden",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "red",
  },
});

export default MarkerCourt;
