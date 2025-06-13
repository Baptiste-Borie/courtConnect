import React from "react";
import { View, StyleSheet } from "react-native";
import MapBox from "../shared/MapBox";
import { SafeAreaView } from "react-native-safe-area-context";

const MapScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <MapBox height="100%" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MapScreen;
