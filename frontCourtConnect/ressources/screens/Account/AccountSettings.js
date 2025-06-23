import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Alert,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { ThemeContext } from "../../context/ThemeContext";
import PageLayout from "../../shared/PageLayout";
import { authFetch } from "../../utils/AuthFetch";
import AuthContext from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AccountSettings = () => {
  const { theme, toggleTheme, themeName } = useContext(ThemeContext);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const { setUser, setIsAuthenticated } = useContext(AuthContext);

  const confirmDeletion = () => {
    Alert.alert(
      "Suppression de compte",
      "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Confirmer", onPress: () => setShowPasswordModal(true) },
      ]
    );
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await authFetch("/api/deleteUser", {
        method: "DELETE",
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        Alert.alert("Compte supprimé", "Votre compte a bien été supprimé.");
      } else {
        const error = await response.json();
        Alert.alert("Erreur", error.message || "Échec de la suppression.");
      }
    } catch (err) {
      console.log("b:", err);
      Alert.alert("Erreur", "Une erreur est survenue.", err.message);
    } finally {
      setShowPasswordModal(false);
      setPassword("");
      setUser(null); // Réinitialiser l'utilisateur dans le contexte
      setIsAuthenticated(false); // Réinitialiser l'état d'authentification
      AsyncStorage.clear(); // Effacer le stockage local
    }
  };

  return (
    <PageLayout
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.settingRow}>
        <Text style={[styles.label, { color: theme.text }]}>Mode sombre</Text>
        <Switch
          value={themeName === "dark"}
          onValueChange={toggleTheme}
          trackColor={{ true: theme.primary }}
          thumbColor="#fff"
        />
      </View>

      <View style={styles.settingRow}>
        <Text style={[styles.label, { color: theme.text }]}>
          Supprimer mon compte
        </Text>
        <TouchableOpacity onPress={confirmDeletion}>
          <Text style={{ color: "red", fontWeight: "bold" }}>Supprimer</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showPasswordModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: theme.background },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Confirmez avec votre mot de passe
            </Text>
            <TextInput
              style={[
                styles.input,
                { borderColor: theme.primary, color: theme.text },
              ]}
              placeholder="Mot de passe"
              secureTextEntry
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                <Text style={{ color: theme.text }}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteAccount}>
                <Text style={{ color: "red", fontWeight: "bold" }}>
                  Supprimer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default AccountSettings;
