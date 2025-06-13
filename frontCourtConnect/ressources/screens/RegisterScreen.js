import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import OrangeButton from "../shared/OrangeButton";
import colors from "../style/color";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    console.log("Inscription avec :", email, password);
  };

  return (
    <View style={styles.container}>
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

      <OrangeButton title="S'inscrire" onPress={handleRegister} />

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Se connecter</Text>
      </TouchableOpacity>
    </View>
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

export default RegisterScreen;
