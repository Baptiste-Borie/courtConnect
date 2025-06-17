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
import AsyncStorage from "@react-native-async-storage/async-storage";

import PageLayout from "../../shared/PageLayout";
import StepTracker from "./StepTracker";
import { ThemeContext } from "../../context/ThemeContext";
import RadioGroup from "../../shared/RadioGroup";
import useTypeList from "../../customHooks/useTypeList";

export default function TerrainFormulaireSecondStep({ route, navigation }) {
  const { theme, themeName } = useContext(ThemeContext);
  const { nom, adresse, coords, usure } = route.params;

  const [nombrePaniers, setNombrePaniers] = useState(0);
  const [typePanier, setTypePanier] = useState("");
  const [typeFilet, setTypeFilet] = useState("");
  const [typeSol, setTypeSol] = useState("");
  const [zoneSpectateurs, setZoneSpectateurs] = useState(false);
  const [remarques, setRemarques] = useState("");

  const { items: typesFilet, loading: loadingFilet } = useTypeList("filet");
  const { items: typesPanier, loading: loadingPanier } = useTypeList("panier");
  const { items: typesSol, loading: loadingSol } = useTypeList("sol");

  const extractAdresseVilleCP = (adresse) => {
    const cpVilleRegex = /(.+),\s*(\d{5})\s(.+)/;
    const match = adresse.match(cpVilleRegex);
    if (match) {
      return {
        adresse: match[1].trim(),
        codePostal: match[2],
        ville: match[3].trim(),
      };
    }
    return { adresse, code_postal: "", ville: "" }; // fallback si format non reconnux
  };

  const handleValidation = async () => {
    const typePanierId = typesPanier.find(
      (item) => item.nom === typePanier
    )?.id;
    const typeFiletId = typesFilet.find((item) => item.nom === typeFilet)?.id;
    const typeSolId = typesSol.find((item) => item.nom === typeSol)?.id;

    if (!typePanierId || !typeFiletId || !typeSolId) {
      Alert.alert("Erreur", "Veuillez compléter tous les champs.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      const {
        adresse: adresseSansVille,
        codePostal,
        ville,
      } = extractAdresseVilleCP(adresse);

      const body = {
        nom,
        adresse: adresseSansVille,
        ville,
        codePostal,
        latitude: coords.latitude,
        longitude: coords.longitude,
        usure,
        nbPanier: nombrePaniers,
        typePanier: typePanierId,
        typeFilet: typeFiletId,
        typeSol: typeSolId,
        spectateur: zoneSpectateurs,
        remarque: remarques,
      };

      const response = await fetch(
        "https://courtconnect.alwaysdata.net/api/addTerrain",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Réponse serveur :", errorText);
        throw new Error(`Erreur serveur ${response.status}`);
      }

      const data = await response.json();
      Alert.alert("Succès", "Le terrain a été ajouté avec succès !");
      navigation.navigate("Home");
    } catch (err) {
      console.error("Erreur :", err);
      Alert.alert("Erreur", "Impossible d'enregistrer le terrain.");
    }
  };

  if (loadingFilet || loadingPanier || loadingSol) {
    return (
      <Text style={{ padding: 20, color: theme.text }}>
        Chargement des types...
      </Text>
    );
  }

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
          options={
            Array.isArray(typesPanier)
              ? typesPanier.map((item) => item.nom)
              : []
          }
          selected={typePanier}
          onChange={setTypePanier}
          theme={theme}
        />

        <Text style={[styles.label, { color: theme.text }]}>Type de filet</Text>
        <RadioGroup
          options={
            Array.isArray(typesFilet) ? typesFilet.map((item) => item.nom) : []
          }
          selected={typeFilet}
          onChange={setTypeFilet}
          theme={theme}
        />

        <Text style={[styles.label, { color: theme.text }]}>Type de sol</Text>
        <RadioGroup
          options={
            Array.isArray(typesSol) ? typesSol.map((item) => item.nom) : []
          }
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
