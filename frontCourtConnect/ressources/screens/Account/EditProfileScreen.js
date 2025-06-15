import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import OrangeButton from "../../shared/OrangeButton";
import PageLayout from "../../shared/PageLayout";
import { ThemeContext } from "../../context/ThemeContext";

export default function EditProfileScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [age, setAge] = useState("");
  const [ville, setVille] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Non autorisé", "Vous devez être connecté.");
        return;
      }

      const response = await fetch(
        "https://courtconnect.alwaysdata.net/api/updateUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username: "",
            nom,
            prenom,
            imageUrl,
            trustability: 0,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          "Profil mis à jour",
          "Vos informations ont été enregistrées."
        );
        navigation.goBack();
      } else {
        Alert.alert("Erreur", data.message || "Une erreur est survenue.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      Alert.alert("Erreur réseau", "Impossible de mettre à jour votre profil.");
    }
  };

  return (
    <PageLayout showFooter={false}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.background },
        ]}
      >
        <Text style={[styles.title, { color: theme.text }]}>
          Compléter votre profil
        </Text>

        <TextInput
          placeholder="Prénom"
          placeholderTextColor={theme.text + "99"}
          value={prenom}
          onChangeText={setPrenom}
          style={[
            styles.input,
            { borderColor: theme.primary, color: theme.text },
          ]}
        />

        <TextInput
          placeholder="Nom"
          placeholderTextColor={theme.text + "99"}
          value={nom}
          onChangeText={setNom}
          style={[
            styles.input,
            { borderColor: theme.primary, color: theme.text },
          ]}
        />

        <TextInput
          placeholder="Âge"
          placeholderTextColor={theme.text + "99"}
          value={age}
          onChangeText={setAge}
          style={[
            styles.input,
            { borderColor: theme.primary, color: theme.text },
          ]}
        />

        <TextInput
          placeholder="Ville"
          placeholderTextColor={theme.text + "99"}
          value={ville}
          onChangeText={setVille}
          style={[
            styles.input,
            { borderColor: theme.primary, color: theme.text },
          ]}
        />

        <TextInput
          placeholder="Image URL (optionnel)"
          placeholderTextColor={theme.text + "99"}
          value={imageUrl}
          onChangeText={setImageUrl}
          style={[
            styles.input,
            { borderColor: theme.primary, color: theme.text },
          ]}
        />

        <OrangeButton title="Valider" onPress={handleSubmit} />
      </ScrollView>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
});
