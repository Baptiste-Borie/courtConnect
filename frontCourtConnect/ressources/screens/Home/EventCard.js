import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getTerrainImageUri, defaultTerrainImage } from "../../utils/GetImage";

export default function EventCard({ event, distance, theme }) {
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate("EventDetail", { eventId: event.id });
  };

  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      const uri = await getTerrainImageUri(event.terrain.id);

      setImageUri(uri);
    };
    fetchImage();
  }, [event?.terrain?.id]);

  return (
    <TouchableOpacity style={[styles.card]} onPress={handlePress}>
      <Image
        source={{ uri: imageUri || defaultTerrainImage }}
        style={{ height: 100, width: "100%" }}
        resizeMode="cover"
      />

      <Text style={[styles.name, { color: theme.text }]}>{event.nom}</Text>
      <Text style={{ color: theme.primary, fontSize: 12 }}>
        {distance.toFixed(1)} km
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    width: 120,
    padding: 8,
    marginRight: 12,
    alignItems: "flex-start",
  },
  name: {
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "flex-start",
  },
});
