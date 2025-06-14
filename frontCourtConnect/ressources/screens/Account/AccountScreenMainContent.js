import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import colors from "../../constants/color";
import assets from "../../constants/assets";

const options = [
  { icon: assets.icons.edit, label: "Modifier mon profil", onPress: () => {} },
  {
    icon: assets.icons.Settings,
    label: "Paramètres du compte",
    onPress: () => {},
  },
  {
    icon: assets.icons.Star,
    label: "Gérer l’abonnement",
    onPress: () => {},
  },
  {
    icon: assets.icons.heart,
    label: "Terrains favoris",
    onPress: () => {},
  },
];

export default function AccountScreenMainContent() {
  return (
    <View style={styles.container}>
      {options.map((item, index) => (
        <View key={index}>
          <TouchableOpacity style={styles.item} onPress={item.onPress}>
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.label}>{item.label}</Text>
            <Image source={assets.icons.chevron_right} style={styles.chevron} />
          </TouchableOpacity>

          {index !== options.length - 1 && <View style={styles.separator} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    backgroundColor: colors.lightBlue,
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
    color: colors.white,
    fontSize: 16,
  },
  chevron: {
    width: 12,
    height: 12,
    tintColor: colors.white,
    position: "absolute",
    right: 16,
  },
  separator: {
    height: 1,
    backgroundColor: colors.orange,
    marginHorizontal: 16,
  },
});
