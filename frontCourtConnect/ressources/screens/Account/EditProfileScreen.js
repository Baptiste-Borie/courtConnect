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

import Button from "../../shared/Button";
import PageLayout from "../../shared/PageLayout";
import { ThemeContext } from "../../context/ThemeContext";
import { authFetch } from "../../utils/AuthFetch";
import AuthContext from "../../context/AuthContext";

export default function EditProfileScreen({ navigation, route }) {
  const { theme } = useContext(ThemeContext);
  const { setUser } = useContext(AuthContext);

  const user = route.params?.data || {};

  const [nom, setNom] = useState(user.nom || "");
  const [prenom, setPrenom] = useState(user.prenom || "");
  const [username, setUsername] = useState(user.username || "");
  const [pseudo, setPseudo] = useState(user.pseudo || "");
  const [imageUrl, setImageUrl] = useState(user.image_url || "");

  const handleSubmit = async () => {
    try {
      const payload = {
        username,
        pseudo,
        nom,
        prenom,
        imageUrl,
        trustability: 0,
      };

      const data = await authFetch("api/updateUser", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const user = await data.json();

      if (!data) {
        throw new Error(
          data.message || "Erreur lors de la mise à jour du profil."
        );
      }

      setUser(user);
      Alert.alert(
        "Profil mis à jour",
        "Vos informations ont été enregistrées."
      );
      navigation.navigate("Account", { refresh: true });
    } catch (error) {
      console.error("Erreur :", error);
      Alert.alert(
        "Erreur",
        error.message || "Impossible de mettre à jour votre profil."
      );
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

        <Button title="Valider" onPress={handleSubmit} />
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
