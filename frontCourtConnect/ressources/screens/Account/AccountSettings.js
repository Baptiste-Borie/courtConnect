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
  const { setUser, setIsAuthenticated } = useContext(AuthContext);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [showDeletePwd, setShowDeletePwd] = useState(false);

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

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
      Alert.alert("Erreur", "Une erreur est survenue.");
    } finally {
      setShowPasswordModal(false);
      setPassword("");
      await AsyncStorage.clear();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await authFetch("/api/changePassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: currentPassword,
          newPassword: newPassword,
        }),
      });

      const json = await response.json();

      if (response.ok) {
        Alert.alert("Succès", "Mot de passe modifié avec succès.");
        setShowChangePasswordModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        Alert.alert("Erreur", json.message || "Échec du changement.");
      }
    } catch (err) {
      Alert.alert("Erreur", "Une erreur est survenue.");
    }
  };

  return (
    <PageLayout
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View
        style={[styles.settingRow, { backgroundColor: theme.background_light }]}
      >
        <Text style={[styles.label, { color: theme.text }]}>Mode sombre</Text>
        <Switch
          value={themeName === "dark"}
          onValueChange={toggleTheme}
          trackColor={{ true: theme.primary }}
          thumbColor="#fff"
        />
      </View>

      <View
        style={[styles.settingRow, { backgroundColor: theme.background_light }]}
      >
        <Text style={[styles.label, { color: theme.text }]}>
          Changer mon mot de passe
        </Text>
        <TouchableOpacity onPress={() => setShowChangePasswordModal(true)}>
          <Text style={{ color: theme.primary, fontWeight: "bold" }}>
            Modifier
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={[styles.settingRow, { backgroundColor: theme.background_light }]}
      >
        <Text style={[styles.label, { color: theme.text }]}>
          Supprimer mon compte
        </Text>
        <TouchableOpacity onPress={confirmDeletion}>
          <Text style={{ color: "red", fontWeight: "bold" }}>Supprimer</Text>
        </TouchableOpacity>
      </View>

      {/* Modal suppression */}
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
              secureTextEntry={!showDeletePwd}
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowDeletePwd(!showDeletePwd)}>
              <Text style={{ color: theme.primary, fontSize: 12 }}>
                {showDeletePwd ? "Masquer" : "Afficher"} le mot de passe
              </Text>
            </TouchableOpacity>
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

      {/* Modal changement mot de passe */}
      <Modal
        visible={showChangePasswordModal}
        animationType="slide"
        transparent
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: theme.background },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Modifier votre mot de passe
            </Text>

            <View style={{ marginBottom: 16 }}>
              <TextInput
                style={[
                  styles.input,
                  { borderColor: theme.primary, color: theme.text },
                ]}
                placeholder="Mot de passe actuel"
                secureTextEntry={!showCurrentPwd}
                placeholderTextColor="#888"
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
              <TouchableOpacity
                onPress={() => setShowCurrentPwd(!showCurrentPwd)}
              >
                <Text style={{ color: theme.primary, fontSize: 12 }}>
                  {showCurrentPwd ? "Masquer" : "Afficher"} le mot de passe
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: 16 }}>
              <TextInput
                style={[
                  styles.input,
                  { borderColor: theme.primary, color: theme.text },
                ]}
                placeholder="Nouveau mot de passe"
                secureTextEntry={!showNewPwd}
                placeholderTextColor="#888"
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity onPress={() => setShowNewPwd(!showNewPwd)}>
                <Text style={{ color: theme.primary, fontSize: 12 }}>
                  {showNewPwd ? "Masquer" : "Afficher"} le mot de passe
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: 16 }}>
              <TextInput
                style={[
                  styles.input,
                  { borderColor: theme.primary, color: theme.text },
                ]}
                placeholder="Confirmer le nouveau mot de passe"
                secureTextEntry={!showConfirmPwd}
                placeholderTextColor="#888"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPwd(!showConfirmPwd)}
              >
                <Text style={{ color: theme.primary, fontSize: 12 }}>
                  {showConfirmPwd ? "Masquer" : "Afficher"} le mot de passe
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setShowChangePasswordModal(false)}
              >
                <Text style={{ color: theme.text }}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleChangePassword}>
                <Text style={{ color: theme.primary, fontWeight: "bold" }}>
                  Modifier
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
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
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
    marginBottom: 8,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
});

export default AccountSettings;
