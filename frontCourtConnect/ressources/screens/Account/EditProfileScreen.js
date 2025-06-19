import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Button from "../../shared/Button";
import PageLayout from "../../shared/PageLayout";
import { ThemeContext } from "../../context/ThemeContext";
import { authFetch } from "../../utils/AuthFetch";
import AuthContext from "../../context/AuthContext";
import { getUserImageUri } from "../../utils/GetImage";

export default function EditProfileScreen({ navigation, route }) {
  const { theme } = useContext(ThemeContext);
  const { setUser } = useContext(AuthContext);

  const user = route.params?.data || {};

  const [nom, setNom] = useState(user.nom || "");
  const [prenom, setPrenom] = useState(user.prenom || "");
  const [username, setUsername] = useState(user.username || "");
  const [pseudo, setPseudo] = useState(user.pseudo || "");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchImage = async () => {
      const uri = await getUserImageUri();
      setImageUrl(uri);
    };

    fetchImage();
  }, []);

  const handleSubmit = async () => {
    if (!username.trim()) {
      Alert.alert("Champ requis", "L'email ne peut pas être vide.");
      return;
    }

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
      navigation.navigate("Home");
    } catch (error) {
      console.error("Erreur :", error);
      Alert.alert(
        "Erreur",
        error.message || "Impossible de mettre à jour votre profil."
      );
    }
  };

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission refusée", "L'accès à la galerie est nécessaire.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setImageUrl(imageUri);
    }

    if (!result.canceled && result.assets?.length > 0) {
      const selected = result.assets[0];

      const formData = new FormData();
      formData.append("image", {
        uri: selected.uri,
        name: "profile.jpg",
        type: "image/jpeg",
      });

      try {
        const token = await AsyncStorage.getItem("token");

        const response = await fetch(
          "https://courtconnect.alwaysdata.net/api/uploadProfilePicture",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
            body: formData,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.error("Erreur upload image :", data);
          Alert.alert(
            "Image non envoyée",
            "L'image n'a pas pu être enregistrée."
          );
          return;
        }
      } catch (err) {
        console.error("❌ Erreur fetch image :", err);
        Alert.alert("Erreur", "Une erreur est survenue pendant l'envoi.");
      }
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

        <TouchableOpacity
          onPress={handleImagePick}
          style={{ marginBottom: 16, alignSelf: "center" }}
        >
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
          ) : (
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: theme.text + "22",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: theme.text + "99" }}>
                Ajouter une photo
              </Text>
            </View>
          )}
        </TouchableOpacity>

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
          placeholder="Pseudo"
          placeholderTextColor={theme.text + "99"}
          value={pseudo}
          onChangeText={setPseudo}
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
