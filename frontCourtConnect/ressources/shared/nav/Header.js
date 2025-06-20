import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";

import { ThemeContext } from "../../context/ThemeContext";
import { authFetch } from "../../utils/AuthFetch";
import ReturnButton from "../ReturnButton";
import assets from "../../constants/assets";
import AuthContext from "../../context/AuthContext";

const Header = ({ content, onLogout, editMode, more, onRefreshEvent }) => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const { setUser } = useContext(AuthContext);

  const [showMenu, setShowMenu] = useState(false);
  const [eventStatus, setEventStatus] = useState(editMode?.data?.etat);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      setUser(null); // Réinitialiser l'utilisateur dans le contexte
      onLogout();
    } catch (err) {
      console.error("Erreur lors du nettoyage du stockage :", err);
    }
  };

  const handleStatusEvent = async () => {
    if (!editMode?.data?.id) return;

    try {
      await authFetch(`/api/changeState/${editMode.data.id}`, {
        method: "POST",
      });

      if (onRefreshEvent) onRefreshEvent();
      setEventStatus((prev) => prev + 1);
    } catch (err) {
      console.error("Erreur lors du changement d'état :", err);
    }

    setShowMenu(false);
  };

  const toggleMenu = () => setShowMenu(!showMenu);

  const getLabelChangeStatus = () => {
    if (eventStatus === 1) return "Terminer l'événement";
    return "Débuter l'événement";
  };

  const handleCancelEvent = async () => {
    if (!editMode?.data?.id) return;

    Alert.alert(
      "Annuler l’événement",
      "Es-tu sûr de vouloir annuler cet événement ?",
      [
        {
          text: "Non",
          style: "cancel",
        },
        {
          text: "Oui",
          style: "destructive",
          onPress: async () => {
            try {
              await authFetch(`/api/cancelEvent/${editMode.data.id}`, {
                method: "POST",
              });

              if (onRefreshEvent) onRefreshEvent();
              setEventStatus(3);
            } catch (err) {
              console.error("Erreur lors de l’annulation :", err);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      <ReturnButton onPress={() => navigation.goBack()} />

      <Text style={[styles.title, { color: theme.text }]}>{content}</Text>

      {more.length >= 1 ? (
        <View>
          <TouchableOpacity
            style={styles.logoutTouchArea}
            onPress={toggleMenu}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image
              source={assets.icons.more}
              style={{ width: 24, height: 24, tintColor: theme.text }}
            />
          </TouchableOpacity>

          {showMenu && eventStatus !== 3 && (
            <View
              style={[
                styles.menu,
                {
                  backgroundColor: theme.background_light,
                  borderColor: theme.primary,
                },
              ]}
            >
              {more.includes("modify") && (
                <TouchableOpacity
                  onPress={() => {
                    setShowMenu(false);
                    navigation.navigate(
                      editMode.type === "event" ? "AddEvent" : "AddTerrain",
                      { data: editMode.data }
                    );
                  }}
                >
                  <Text style={{ color: theme.text, padding: 8 }}>
                    Modifier
                  </Text>
                </TouchableOpacity>
              )}

              {more.includes("statusEvent") && eventStatus < 2 && (
                <TouchableOpacity
                  onPress={() => {
                    setShowMenu(false);
                    handleStatusEvent();
                  }}
                >
                  <Text style={{ color: theme.text, padding: 8 }}>
                    {getLabelChangeStatus()}
                  </Text>
                </TouchableOpacity>
              )}
              {more.includes("cancelEvent") && eventStatus === 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setShowMenu(false);
                    handleCancelEvent();
                  }}
                >
                  <Text style={{ color: theme.text, padding: 8 }}>
                    Annuler l'événement
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      ) : onLogout ? (
        <TouchableOpacity
          style={styles.logoutTouchArea}
          onPress={handleLogout}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image
            source={assets.icons.logout}
            style={{ width: 24, height: 24, tintColor: theme.text }}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    position: "relative",
    justifyContent: "flex-end",
    paddingBottom: 10,
    paddingLeft: 10,
  },
  title: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 18,
    pointerEvents: "none",
  },
  logoutTouchArea: {
    position: "absolute",
    bottom: 5,
    right: 10,
    padding: 10,
    paddingVertical: 5,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  menu: {
    position: "absolute",
    top: -5,
    right: 0,
    borderWidth: 1,
    borderRadius: 6,
    zIndex: 999,
  },
});

export default Header;
