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

export default function EditProfileScreen({ navigation, route }) {
  const { theme } = useContext(ThemeContext);

  const user = route.params?.data || {};

  const [nom, setNom] = useState(user.nom || "");
  const [prenom, setPrenom] = useState(user.prenom || "");
  const [username, setUsername] = useState(user.username || "");
  const [pseudo, setPseudo] = useState(user.pseudo || "");
  const [imageUrl, setImageUrl] = useState(user.image_url || "");

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
            username,
            pseudo,
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
        navigation.navigate("Account", { refresh: true });
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
          placeholder="Email"
          placeholderTextColor={theme.text + "99"}
          value={username}
          onChangeText={setUsername}
          style={[
            styles.input,
            { borderColor: theme.primary, color: theme.text },
          ]}
        />

        <TextInput
          placeholder="Pseudo (optionnel)"
          placeholderTextColor={theme.text + "99"}
          value={pseudo}
          onChangeText={setPseudo}
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
