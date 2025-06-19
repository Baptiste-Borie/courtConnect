import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";

import { ThemeContext } from "../../context/ThemeContext";
import ReturnButton from "../ReturnButton";
import assets from "../../constants/assets";

const Header = ({ content, onLogout, editMode }) => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    onLogout();
  };

  const toggleMenu = () => setShowMenu(!showMenu);

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      <ReturnButton onPress={() => navigation.goBack()} />

      <Text style={[styles.title, { color: theme.text }]}>{content}</Text>

      {editMode ? (
        <View>
          <TouchableOpacity
            style={styles.logoutTouchArea}
            onPress={toggleMenu}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image
              source={assets.icons.more}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>

          {showMenu && (
            <View
              style={[
                styles.menu,
                {
                  backgroundColor: theme.background_light,
                  borderColor: theme.primary,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  setShowMenu(false);
                  navigation.navigate(
                    editMode.type === "event" ? "AddEvent" : "AddTerrain",
                    { data: editMode.data }
                  );
                }}
              >
                <Text style={{ color: theme.text, padding: 8 }}>Modifier</Text>
              </TouchableOpacity>
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
            style={{ width: 24, height: 24 }}
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
