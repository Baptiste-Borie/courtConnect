import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Button from "../shared/Button";
import PageLayout from "../shared/PageLayout";
import { ThemeContext } from "../context/ThemeContext";

const AuthScreen = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(false); // false = inscription par défaut
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { theme } = useContext(ThemeContext);

  const handleSubmit = async () => {
    const route = isLogin ? "api/login" : "register";
    const url = `https://courtconnect.alwaysdata.net/${route}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("❌ Réponse non JSON :", text);
        throw new Error("Réponse invalide reçue du serveur.");
      }

      if (response.ok) {
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("refresh_token", data.refresh_token);
        onLogin();
      } else {
        Alert.alert("Erreur", data.message || "Une erreur est survenue.");
      }
    } catch (error) {
      console.error("❌ Erreur réseau :", error);
      Alert.alert("Erreur réseau", "Veuillez réessayer plus tard.");
    }
  };

  return (
    <PageLayout
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Text style={[styles.title, { color: theme.primary }]}>CourtConnect</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          placeholderTextColor={theme.text + "99"}
          style={[
            styles.input,
            { borderColor: theme.primary, color: theme.text },
          ]}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Mot de passe"
          placeholderTextColor={theme.text + "99"}
          secureTextEntry
          style={[
            styles.input,
            { borderColor: theme.primary, color: theme.text },
          ]}
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <Text
        style={{
          color: theme.text + "99",
          marginBottom: 32,
          fontSize: 12,
          textAlign: "center",
        }}
      >
        Le mot de passe doit contenir au moins 8 caractères, 1 majuscule, 1
        chiffre et 1 caractère spécial.
      </Text>

      <Button
        title={isLogin ? "Se connecter" : "S'inscrire"}
        onPress={handleSubmit}
      />

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={[styles.link, { color: theme.primary }]}>
          {isLogin ? "Créer un compte" : "Déjà inscrit ? Se connecter"}
        </Text>
      </TouchableOpacity>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 32,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 24,
    gap: 12,
  },
  input: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  link: {
    marginTop: 16,
    textDecorationLine: "underline",
  },
});

export default AuthScreen;
