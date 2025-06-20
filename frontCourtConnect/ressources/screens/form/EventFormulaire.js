import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import PageLayout from "../../shared/PageLayout";
import StepTracker from "./StepTracker";
import { ThemeContext } from "../../context/ThemeContext";
import MapBox from "../../shared/MapBox";
import Button from "../../shared/Button";
import { authFetch } from "../../utils/AuthFetch";
import SearchTerrain from "./SearchTerrain";

export default function EventFormulaire({ navigation, route }) {
  const { data: event } = route.params || {};
  const { theme } = useContext(ThemeContext);

  const [isLoadingTerrains, setIsLoadingTerrains] = useState(true);

  const [nom, setNom] = useState("");
  const [terrains, setTerrains] = useState([]);
  const [selectedTerrain, setSelectedTerrain] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [mapMarkers, setMapMarkers] = useState([]);

  useEffect(() => {
    if (event) {
      setNom(event.nom);
      setSelectedTerrain(event.terrain.id);
      if (event.terrain) {
        setMapRegion({
          latitude: event.terrain.latitude,
          longitude: event.terrain.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
        setMapMarkers([
          {
            coordinate: {
              latitude: event.terrain.latitude,
              longitude: event.terrain.longitude,
            },
            title: event.terrain.nom,
            description: event.terrain.adresse || "",
          },
        ]);
      }
    }
  }, [event]);

  const handleGoToNextStep = () => {
    if (!nom || !selectedTerrain) {
      Alert.alert("Champs manquants", "Veuillez remplir tous les champs.");
      return;
    }

    const terrain = terrains.find((t) => t.id === selectedTerrain);
    if (!terrain) {
      Alert.alert(
        "Terrain invalide",
        "Le terrain sélectionné est introuvable."
      );
      return;
    }

    navigation.navigate("AddEventSecond", {
      nom,
      terrainId: terrain.id,
      editMode: event,
    });
  };

  useEffect(() => {
    const fetchTerrains = async () => {
      try {
        setIsLoadingTerrains(true);
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.warn("Aucun token disponible");
          return;
        }

        const res = await authFetch("getAllValidatedTerrains", {
          method: "GET",
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Erreur fetch terrains :", errorText);
          return;
        }

        const data = await res.json();
        setTerrains(data);
      } catch (error) {
        console.error("Erreur récupération terrains :", error);
      } finally {
        setIsLoadingTerrains(false);
      }
    };

    fetchTerrains();
  }, []);

  useEffect(() => {
    if (!selectedTerrain || terrains.length === 0) return;

    const terrain = terrains.find((t) => t.id === selectedTerrain);
    if (terrain?.latitude && terrain?.longitude) {
      setMapRegion({
        latitude: terrain.latitude,
        longitude: terrain.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

      setMapMarkers([
        {
          coordinate: {
            latitude: terrain.latitude,
            longitude: terrain.longitude,
          },
          title: terrain.nom,
          description: terrain.adresse || "",
        },
      ]);
    }
  }, [selectedTerrain, terrains]);

  return (
    <PageLayout
      showFooter={false}
      headerContent={event ? "Modifier l'événement" : "Créer un événement"}
    >
      <StepTracker
        currentStep={1}
        onStepChange={(step) => {
          if (step === 2) handleGoToNextStep();
        }}
      />
      <View style={styles.container}>
        <Text style={[styles.label, { color: theme.text }]}>
          Nom de l'événement
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

        <Text style={[styles.label, { color: theme.text }]}>Terrain</Text>
        {isLoadingTerrains ? (
          <ActivityIndicator
            size="large"
            color={theme.primary}
            style={{ marginVertical: 20 }}
          />
        ) : (
          <View
            style={[
              styles.pickerContainer,
              {
                backgroundColor: theme.background_light,
                borderColor: theme.primary,
              },
            ]}
          >
            <SearchTerrain
              selectedTerrainId={selectedTerrain}
              onSelect={setSelectedTerrain}
            />
          </View>
        )}

        {mapRegion && (
          <>
            <Text
              style={[
                styles.label,
                { color: theme.text, fontWeight: "100", fontSize: 12 },
              ]}
            >
              Localisation du terrain
            </Text>

            <MapBox
              style={{ width: "100%", height: 250 }}
              region={mapRegion}
              terrainMarkers={mapMarkers}
            />
          </>
        )}
        <Button
          title="Suivant"
          onPress={handleGoToNextStep}
          style={{ marginVertical: 10 }}
        />
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
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    width: "100%",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});
