import React from "react";
import { View, StyleSheet, Button } from "react-native";
import MapBox from "../shared/MapBox";
import ReturnButton from "../shared/ReturnButton";
import { SafeAreaView } from "react-native-safe-area-context";

const MapScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <MapBox height="100%" /> 
      <ReturnButton  onPress={() => {navigation.navigate("Home")}} />
    </SafeAreaView>
  );
};
//ReturnButton à enlever quand le layout sera pret
// commentaire de test pour un commit 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"black",
  },
});

export default MapScreen;
