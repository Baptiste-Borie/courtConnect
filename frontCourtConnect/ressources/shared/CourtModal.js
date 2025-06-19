import {React, useContext} from "react";
import {Modal,View,Text,StyleSheet,TouchableOpacity,Dimensions,} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { getDistance } from "../utils/GetDistance"; 
import { ThemeContext } from "../context/ThemeContext"; 

const { width } = Dimensions.get("window");

const CourtModal = ({ visible, onClose, marker, userLocation }) => {
  const {theme}  = useContext(ThemeContext);
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
        <View style={[styles.container, {backgroundColor: theme.background}]}>
          <Text style={styles.title}>{marker.title}</Text>
          <Text style={[styles.description, {color: theme.text}]}>Distance :</Text>
          <Text style={styles.coord}>{distance} km</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              onClose();
              navigation.navigate("AddEvent"); //à CHANGER on veut la page des events du terrain, pas du formulaire
            }}
          >
            <Text style={styles.buttonText}>Voir les événements</Text>
          </TouchableOpacity>

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
    color: "#FC7518",
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
    backgroundColor: "#FC7518",
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
