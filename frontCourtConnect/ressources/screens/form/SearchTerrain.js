import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  ScrollView,
  StyleSheet,
  Keyboard,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { authFetch } from "../../utils/AuthFetch";

export default function SearchTerrain({ onSelect, selectedTerrainId }) {
  const { theme } = useTheme();

  const [terrains, setTerrains] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(true);

  useEffect(() => {
    const fetchTerrains = async () => {
      try {
        const res = await authFetch("getAllValidatedTerrains");
        const data = await res.json();
        setTerrains(data);
      } catch (err) {
        console.error("Erreur chargement terrains :", err);
      }
    };

    fetchTerrains();
  }, []);

  const filteredTerrains = terrains.filter((terrain) =>
    terrain.nom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedTerrain =
    terrains.find((t) => t.id === selectedTerrainId) || null;

  return (
    <View style={{ width: "100%", marginBottom: 16 }}>
      <TextInput
        value={selectedTerrain ? selectedTerrain.nom : searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          setShowDropdown(true);
          onSelect(null);
        }}
        placeholder="Rechercher un terrain..."
        placeholderTextColor={theme.text + "99"}
        style={[
          styles.input,
          { borderColor: theme.primary, color: theme.text },
        ]}
      />

      {showDropdown && filteredTerrains.length > 0 && (
        <View
          style={{
            backgroundColor: theme.background_light,
            maxHeight: 150,
            marginTop: 4,
          }}
        >
          <ScrollView keyboardShouldPersistTaps="handled">
            {filteredTerrains.map((terrain) => (
              <Text
                key={terrain.id}
                style={{
                  padding: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: theme.background,
                  color: theme.text,
                }}
                onPress={() => {
                  onSelect(terrain.id);
                  setSearchQuery("");
                  setShowDropdown(false);
                  Keyboard.dismiss();
                }}
              >
                {terrain.nom}
              </Text>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    borderRadius: 8,
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
