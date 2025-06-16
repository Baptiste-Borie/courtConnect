import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";
import assets from "../constants/assets";
import { useTheme } from "../context/ThemeContext";

export default function AddModal({
  visible,
  onClose,
  onAddTerrain,
  onAddEvent,
}) {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose} />

      <View
        style={[styles.container, { backgroundColor: theme.background_light }]}
      >
        <Text style={[styles.title, { color: theme.text }]}>
          Ajouter un terrain ou un événement
        </Text>

        <View style={styles.buttonsRow}>
          <TouchableOpacity style={styles.button} onPress={onAddTerrain}>
            <Image source={assets.terrain} style={styles.image} />
            <Text style={[styles.label, { color: theme.text }]}>
              Ajouter un terrain
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={onAddEvent}>
            <Image source={assets.ballon} style={styles.image} />
            <Text style={[styles.label, { color: theme.text }]}>
              Ajouter un événement
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    height: 250,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    gap: 36,
    width: "100%",
  },

  button: {
    width: 120,
    alignItems: "center",
  },

  image: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },

  label: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
});
