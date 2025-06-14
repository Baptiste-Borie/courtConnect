import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OrangeButton from "../shared/OrangeButton";
import colors from "../style/color";
import PageLayout from "../shared/PageLayout";

const AuthScreen = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(false); // false = inscription par défaut
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        console.log(
          `✅ ${isLogin ? "Connexion" : "Inscription"} réussie`,
          data
        );

        if (isLogin) {
          await AsyncStorage.setItem("token", data.token);
          onLogin();
        } else {
          Alert.alert(
            "Succès",
            "Inscription réussie, connectez-vous maintenant."
          );
          setIsLogin(true);
        }
      } else {
        Alert.alert("Erreur", data.message || "Une erreur est survenue.");
      }
    } catch (error) {
      console.error("❌ Erreur réseau :", error);
      Alert.alert("Erreur réseau", "Veuillez réessayer plus tard.");
    }
  };

  return (
    <PageLayout style={styles.container}>
      <Text style={styles.title}>CourtConnect</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          placeholderTextColor={colors.white + "99"}
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Mot de passe"
          placeholderTextColor={colors.white + "99"}
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <OrangeButton
        title={isLogin ? "Se connecter" : "S'inscrire"}
        onPress={handleSubmit}
      />

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.link}>
          {isLogin ? "Créer un compte" : "Déjà inscrit ? Se connecter"}
        </Text>
      </TouchableOpacity>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBlue,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    color: colors.orange,
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
    borderColor: colors.orange,
    borderWidth: 1,
    borderRadius: 8,
    color: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  link: {
    color: colors.orange,
    marginTop: 16,
    textDecorationLine: "underline",
  },
});

export default AuthScreen;
