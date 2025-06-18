import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import CustomDateTimePicker from "../../shared/CustomDateTimePicker";
import PageLayout from "../../shared/PageLayout";
import StepTracker from "./StepTracker";
import { ThemeContext } from "../../context/ThemeContext";
import RadioGroup from "../../shared/RadioGroup";
import useTypeList from "../../customHooks/useTypeList";
import { authFetch } from "../../utils/AuthFetch";

export default function EventFormulaireSecondStep({ route, navigation }) {
  const { theme } = useContext(ThemeContext);
  const { nom, terrainId } = route.params;

  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [maxJoueurs, setMaxJoueurs] = useState(10);
  const [niveau, setNiveau] = useState("1");
  const [typeEvent, setTypeEvent] = useState("");

  const { items: typeEvents, loading: loadingTypes } = useTypeList("event");

  const handleValidation = async () => {
    const typeEventId = typeEvents.find((item) => item.nom === typeEvent)?.id;

    if (!description || !typeEventId) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      const body = {
        nom,
        description,
        dateHeure: date.toISOString(),
        maxJoueurs: maxJoueurs,
        niveau: parseInt(niveau),
        terrain: terrainId,
        typeEvent: typeEventId,
      };

      const response = await authFetch("api/addEvent", {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Réponse serveur :", errorText);
        throw new Error(`Erreur serveur ${response.status}`);
      }

      const data = await response.json();
      Alert.alert("Succès", "L'événement a été créé avec succès !");
      navigation.navigate("Home");
    } catch (err) {
      console.error("Erreur :", err);
      Alert.alert("Erreur", "Impossible de créer l'événement.");
    }
  };

  if (loadingTypes) {
    return (
      <Text style={{ padding: 20, color: theme.text }}>
        Chargement des types...
      </Text>
    );
  }

  return (
    <PageLayout headerContent="Créer un événement" showFooter={false}>
      <StepTracker
        currentStep={2}
        onStepChange={(step) => {
          if (step === 1) navigation.goBack();
        }}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.label, { color: theme.text }]}>Description</Text>
        <TextInput
          placeholder="Ex: match entre amis"
          placeholderTextColor={theme.text + "99"}
          value={description}
          onChangeText={setDescription}
          style={[
            styles.input,
            {
              backgroundColor: theme.background_light,
              color: theme.text,
              borderColor: theme.primary,
            },
          ]}
        />
        <Text style={[styles.label, { color: theme.text }]}>Date & heure</Text>
        <CustomDateTimePicker value={date} onChange={setDate} theme={theme} />

        <Text style={[styles.label, { color: theme.text }]}>
          Nombre de joueurs max
        </Text>
        <TextInput
          keyboardType="numeric"
          placeholderTextColor={theme.text + "99"}
          value={String(maxJoueurs)}
          onChangeText={(value) => setMaxJoueurs(parseInt(value) || 0)}
          style={[
            styles.input,
            {
              backgroundColor: theme.background_light,
              color: theme.text,
              borderColor: theme.primary,
            },
          ]}
        />
        <Text style={[styles.label, { color: theme.text }]}>Niveau requis</Text>
        <RadioGroup
          options={[
            { label: "Débutant", value: "0" },
            { label: "Intermédiaire", value: "1" },
            { label: "Expert", value: "2" },
          ]}
          selected={niveau}
          onChange={setNiveau}
          theme={theme}
        />

        <Text style={[styles.label, { color: theme.text }]}>
          Type d'événement
        </Text>
        <RadioGroup
          options={typeEvents.map((e) => e.nom)}
          selected={typeEvent}
          onChange={setTypeEvent}
          theme={theme}
        />
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleValidation}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            Créer l'événement
          </Text>
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
  button: {
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
});
