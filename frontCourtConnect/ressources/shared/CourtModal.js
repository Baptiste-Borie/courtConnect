import { React, useContext } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { getDistance } from "../utils/GetDistance";
import { ThemeContext } from "../context/ThemeContext";
import Button from "./Button";

const { width } = Dimensions.get("window");

const CourtModal = ({ visible, onClose, marker, userLocation }) => {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();

  if (!marker) return null;

  const distance = userLocation
    ? getDistance(
        userLocation.coordinate.latitude,
        userLocation.coordinate.longitude,
        marker.coordinate.latitude,
        marker.coordinate.longitude
      ).toFixed(2)
    : "N/A";

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <Text style={[styles.title, { color: theme.primary }]}>
            {marker.title}
          </Text>
          <Text style={[styles.description, { color: theme.text }]}>
            Distance :
          </Text>
          <Text style={styles.coord}>{distance} km</Text>

          <Button
            title={"Voir le terrain"}
            onPress={() => {
              onClose();
              navigation.navigate("TerrainDetail", {
                terrainId: marker.id,
              });
            }}
            style={styles.button}
          />
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: width * 0.85,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    marginBottom: 4,
  },
  coord: {
    fontSize: 12,
    marginBottom: 20,
    color: "#555",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  close: {
    color: "#999",
    textDecorationLine: "underline",
  },
});

export default CourtModal;
