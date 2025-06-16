import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from "react-native";
import PageLayout from "../../shared/PageLayout";
import StepTracker from "./StepTracker";
import { ThemeContext } from "../../context/ThemeContext";
import RadioGroup from "../../shared/RadioGroup";

const TYPE_PANIERS = {
  Bois: 2,
  Plexiglas: 3,
  Acrylique: 4,
  Polycarbonate: 5,
  Métal: 6,
  Composite: 7,
};

const TYPE_FILETS = {
  Nylon: 3,
  Chaîne: 4,
  Plastique: 5,
  "Sans filet": 6,
};

const TYPE_SOLS = {
  Béton: 2,
  Bitume: 3,
  Résine: 4,
  "Gazon Synthétique": 5,
};

export default function TerrainFormulaireSecondStep({ route, navigation }) {
  const { theme, themeName } = useContext(ThemeContext);
  const { nom, adresse, coords, usure } = route.params;

  const [nombrePaniers, setNombrePaniers] = useState(0);
  const [typePanier, setTypePanier] = useState("");
  const [typeFilet, setTypeFilet] = useState("");
  const [typeSol, setTypeSol] = useState("");
  const [zoneSpectateurs, setZoneSpectateurs] = useState(false);
  const [remarques, setRemarques] = useState("");

  const handleValidation = async () => {
    if (
      !TYPE_PANIERS[typePanier] ||
      !TYPE_FILETS[typeFilet] ||
      !TYPE_SOLS[typeSol]
    ) {
      Alert.alert("Champs manquants", "Veuillez compléter tous les champs.");
      return;
    }

    try {
      const body = {
        nom,
        adresse,
        latitude: coords.latitude,
        longitude: coords.longitude,
        usure,
        nombrePaniers,
        typePanier: TYPE_PANIERS[typePanier],
        typeFilet: TYPE_FILETS[typeFilet],
        typeSol: TYPE_SOLS[typeSol],
        zoneSpectateurs,
        remarques,
      };

      const response = await fetch(
        "https://courtconnect.alwaysdata.net/app_add_terrain",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur serveur : ${response.status}`);
      }

      const data = await response.json();
      console.log("Terrain ajouté :", data);
      Alert.alert("Succès", "Le terrain a été ajouté avec succès.");
      // navigation.navigate("Home"); // ou autre page
    } catch (err) {
      console.error("Erreur :", err);
      Alert.alert("Erreur", "Impossible d'enregistrer le terrain.");
    }
  };

  return (
    <PageLayout headerContent="Ajouter un terrain" showFooter={false}>
      <StepTracker currentStep={2} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.label, { color: theme.text }]}>
          Nombres de paniers
        </Text>
        <TextInput
          keyboardType="numeric"
          value={String(nombrePaniers)}
          onChangeText={(value) => setNombrePaniers(parseInt(value) || 0)}
          style={[
            styles.input,
            {
              backgroundColor: theme.background_light,
              color: theme.text,
              borderColor: theme.primary,
            },
          ]}
        />

        <Text style={[styles.label, { color: theme.text }]}>
          Type de panier
        </Text>
        <RadioGroup
          options={Object.keys(TYPE_PANIERS)}
          selected={typePanier}
          onChange={setTypePanier}
          theme={theme}
        />

        <Text style={[styles.label, { color: theme.text }]}>Type de filet</Text>
        <RadioGroup
          options={Object.keys(TYPE_FILETS)}
          selected={typeFilet}
          onChange={setTypeFilet}
          theme={theme}
        />

        <Text style={[styles.label, { color: theme.text }]}>Type de sol</Text>
        <RadioGroup
          options={Object.keys(TYPE_SOLS)}
          selected={typeSol}
          onChange={setTypeSol}
          theme={theme}
        />

        <View style={styles.row}>
          <Text style={{ color: theme.text }}>Zone spectateurs</Text>
          <Switch
            value={zoneSpectateurs}
            onValueChange={() => setZoneSpectateurs(!zoneSpectateurs)}
            trackColor={{ true: theme.primary }}
            thumbColor={themeName === "dark" ? "#fff" : "#fff"}
          />
        </View>

        <Text style={[styles.label, { color: theme.text }]}>Remarques</Text>
        <TextInput
          placeholder="Tapez ici ..."
          value={remarques}
          onChangeText={setRemarques}
          multiline
          style={[
            styles.textarea,
            {
              backgroundColor: theme.background_light,
              color: theme.text,
              borderColor: theme.primary,
            },
          ]}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleValidation}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Valider</Text>
        </TouchableOpacity>
      </ScrollView>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  textarea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    height: 100,
    marginBottom: 24,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
  },
  button: {
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
  },
});
