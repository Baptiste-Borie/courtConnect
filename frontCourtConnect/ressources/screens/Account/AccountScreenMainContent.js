import React, { useContext } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { ThemeContext } from "../../context/ThemeContext";
import assets from "../../constants/assets";
import AuthContext from "../../context/AuthContext";

export default function AccountScreenMainContent({ data }) {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const options = [
    {
      icon: assets.icons.edit,
      label: "Modifier mon profil",
      onPress: () =>
        navigation.navigate("EditAccount", {
          data,
        }),
    },
    {
      icon: assets.icons.Settings,
      label: "Paramètres du compte",
      onPress: () => {
        navigation.navigate("AccountSettings");
      },
    },
    {
      icon: assets.icons.Star,
      label: "Gérer l’abonnement",
      onPress: () => {
        navigation.navigate("SubscribeScreen");
      },
    },
    {
      icon: assets.icons.heart,
      label: "Terrains favoris",
      onPress: () => { },
    },
    {
      icon: assets.icons.time,
      label: "Terrains en attente",
      onPress: () => {
        navigation.navigate("WaitingCourts", {
          data,
        })
      },
    },
    {
      icon: assets.icons.time,
      label: "Mes événements",
      onPress: () => {
        navigation.navigate("MyEvents", {
          data, theme
        })
      },
    },
  ];

  return (
    <View
      style={[styles.container, { backgroundColor: theme.background_light }]}
    >
      {options.map((item, index) => (
        <View key={index}>
          <TouchableOpacity style={styles.item} onPress={item.onPress}>
            <Image
              source={item.icon}
              style={[styles.icon, { tintColor: theme.text }]}
            />
            <Text style={[styles.label, { color: theme.text }]}>
              {item.label}
            </Text>
            <Image
              source={assets.icons.chevron_right}
              style={[styles.chevron, { tintColor: theme.text }]}
            />
          </TouchableOpacity>

          {index !== options.length - 1 && (
            <View
              style={[
                styles.separator,
                { backgroundColor: theme.primary + "66" },
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 4,
    width: "90%",
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    position: "relative",
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 12,
    resizeMode: "contain",
  },
  label: {
    fontSize: 16,
  },
  chevron: {
    width: 12,
    height: 12,
    position: "absolute",
    right: 16,
  },
  separator: {
    height: 1,
    marginHorizontal: 16,
  },
});
