import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import { useRef } from "react";
import * as ImagePicker from "expo-image-picker";

import PageLayout from "../../shared/PageLayout";
import StepTracker from "./StepTracker";
import { ThemeContext } from "../../context/ThemeContext";
import MapBox from "../../shared/MapBox";
import assets from "../../constants/assets";
import Button from "../../shared/Button";

export default function TerrainFormulaire({ navigation, route }) {
  const { theme } = useContext(ThemeContext);
  const { data: terrain } = route.params || {};

  const debounceTimer = useRef(null);

  const [nom, setNom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [selectedCoords, setSelectedCoords] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
  });
  const [usure, setUsure] = useState(3);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    if (terrain) {
      setNom(terrain.nom || "");
      setAdresse(terrain.adresse || "");
      setSelectedCoords({
        latitude: terrain.coords?.latitude || 48.8566,
        longitude: terrain.coords?.longitude || 2.3522,
      });
      setUsure(terrain.usure || 3);
      fetchAddress({
        latitude: terrain.coords?.latitude || 48.8566,
        longitude: terrain.coords?.longitude || 2.3522,
      });
    }
  }, [terrain]);

  // Reverse geocoding à chaque changement de position
  const fetchAddress = async (coords) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission refusée", "La géolocalisation est nécessaire.");
        return;
      }

      const [place] = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      if (place) {
        const formatted =
          `${place.name ? place.name + ", " : ""}` +
          `${place.street ? place.street + ", " : ""}` +
          `${place.postalCode ? place.postalCode + " " : ""}` +
          `${place.city || place.region || ""}`;
        setAdresse(formatted.trim());
      }
    } catch (e) {
      console.warn("Erreur reverse geocoding :", e);
    }
  };

  const handleGoToNextStep = () => {
    if (!nom || !adresse) {
      Alert.alert("Champs manquants", "Veuillez remplir tous les champs.");
      return;
    }
    if (usure < 1 || usure > 5) {
      Alert.alert(
        "Usure invalide",
        "Veuillez sélectionner une usure entre 1 et 5."
      );
      return;
    }
    navigation.navigate("AddTerrainSecond", {
      nom,
      adresse,
      coords: selectedCoords,
      usure,
      photo,
      editMode: terrain,
    });
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission refusée", "L'accès à la galerie est nécessaire.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setPhoto(imageUri);
    } else {
      console.err("❌ Sélection annulée");
    }
  };

  const usureLabels = [
    "Délabré",
    "Mauvais état",
    "Légérement usé",
    "Presque neuf",
    "Neuf",
  ];

  return (
    <PageLayout
      showFooter={false}
      headerContent={terrain ? "Modifier le terrain" : "Ajouter un terrain"}
    >
      <StepTracker
        currentStep={1}
        onStepChange={(step) => {
          if (step === 2) handleGoToNextStep();
        }}
      />
      <View style={styles.container}>
        <Text style={[styles.label, { color: theme.text }]}>
          Nom du terrain
        </Text>
        <TextInput
          placeholder="Nom"
          placeholderTextColor={theme.text + "99"}
          value={nom}
          onChangeText={setNom}
          style={[
            styles.input,
            {
              backgroundColor: theme.background_light,
              borderColor: theme.primary,
              color: theme.text,
            },
          ]}
        />

        <Text style={[styles.label, { color: theme.text }]}>
          Adresse du terrain
        </Text>
        <TextInput
          placeholder="Adresse"
          placeholderTextColor={theme.text + "99"}
          value={adresse}
          editable={false}
          onChangeText={setAdresse}
          style={[
            styles.input,
            {
              backgroundColor: theme.background_light,
              borderColor: theme.primary,
              color: theme.text,
              opacity: 0.5,
            },
          ]}
        />

        <Text
          style={[
            styles.label,
            { color: theme.text, fontWeight: "100", fontSize: 12 },
          ]}
        >
          Placer le marqueur sur la carte pour définir l'adresse
        </Text>

        <MapBox
          style={{ width: "100%", height: 250 }}
          centerMaker={true}
          initalRegion={{
            ...selectedCoords,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onRegionChange={(region) => {
            setSelectedCoords({
              latitude: region.latitude,
              longitude: region.longitude,
            });

            if (debounceTimer.current) {
              clearTimeout(debounceTimer.current);
            }

            debounceTimer.current = setTimeout(() => {
              fetchAddress(region);
            }, 600);
          }}
        />

        <Text style={[styles.label, { color: theme.text, marginTop: 16 }]}>
          Usure du terrain
        </Text>
        <Text
          style={{ color: theme.text + "99", fontSize: 12, marginBottom: 8 }}
        >
          {usureLabels[usure - 1]}
        </Text>

        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((index) => (
            <TouchableOpacity key={index} onPress={() => setUsure(index)}>
              <Image
                source={
                  index <= usure ? assets.icons.star_filled : assets.icons.star
                }
                style={styles.star}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { color: theme.text }]}>
          Photo du terrain (optionnel)
        </Text>

        <TouchableOpacity
          onPress={() => {
            pickImage();
          }}
          style={{ marginBottom: 16 }}
        >
          {photo ? (
            <Image
              source={{ uri: photo }}
              style={{ width: 200, height: 120, borderRadius: 8 }}
            />
          ) : (
            <View
              style={{
                width: 120,
                height: 70,
                borderWidth: 1,
                borderColor: theme.primary,
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: theme.text + "99", fontSize: 10 }}>
                {photo ? "Image sélectionnée" : "Choisir une image"}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <Button title="Suivant" onPress={handleGoToNextStep} />
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 30,
  },
  input: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderRadius: 8,
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  label: {
    textAlign: "left",
    width: "100%",
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  star: {
    width: 32,
    height: 32,
    marginHorizontal: 4,
    resizeMode: "contain",
  },
});
