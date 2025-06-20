import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";

import { authFetch } from "../utils/AuthFetch";

export default function TerrainEventSearchBar({ theme, style = {} }) {
  const navigation = useNavigation();
  const [terrains, setTerrains] = useState([]);
  const [events, setEvents] = useState([]);
  const [query, setQuery] = useState("");
  const [filteredTerrains, setFilteredTerrains] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [terrainsRes, eventsRes] = await Promise.all([
          authFetch("/getAllValidatedTerrains"),
          authFetch("/api/getOnGoingEvents"),
        ]);

        const terrainsData = await terrainsRes.json();
        const eventsData = await eventsRes.json();

        setTerrains(terrainsData);
        setEvents(eventsData);
      } catch (err) {
        console.error("Erreur fetch terrains ou events :", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (query.trim() === "") {
      setFilteredTerrains([]);
      setFilteredEvents([]);
      return;
    }

    const lowerQuery = query.toLowerCase();

    const terrainsResults = terrains.filter((terrain) =>
      terrain.nom.toLowerCase().includes(lowerQuery)
    );

    const eventsResults = events.filter((event) =>
      event.nom.toLowerCase().includes(lowerQuery)
    );

    setFilteredTerrains(terrainsResults);
    setFilteredEvents(eventsResults);
  }, [query]);

  return (
    <View style={[style, { flex: 1, marginTop: 10 }]}>
      <TextInput
        placeholder="Rechercher un terrain ou un événement"
        placeholderTextColor={theme.text + "99"}
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          setShowResults(true);
        }}
        style={{
          backgroundColor: theme.background_light,
          borderColor: theme.primary,
          color: theme.text,
          borderWidth: 1,
          borderRadius: 8,
          padding: 8,
          marginRight: 10,
          height: 40,
        }}
      />

      {showResults &&
        (filteredTerrains.length > 0 || filteredEvents.length > 0) && (
          <View
            style={{
              backgroundColor: theme.background_light,
              borderRadius: 8,
              marginTop: 4,
              padding: 4,
              maxHeight: 300,
            }}
          >
            {filteredTerrains.length > 0 && (
              <>
                <Text
                  style={{
                    color: theme.primary,
                    marginVertical: 4,
                    fontWeight: "bold",
                  }}
                >
                  Terrains
                </Text>
                {filteredTerrains.map((item) => (
                  <TouchableOpacity
                    key={`terrain-${item.id}`}
                    onPress={() => {
                      setQuery(item.nom);
                      setShowResults(false);
                      navigation.navigate("TerrainDetail", {
                        terrainId: item.id,
                      });
                    }}
                    style={{ padding: 6 }}
                  >
                    <Text style={{ color: theme.text }}>{item.nom}</Text>
                  </TouchableOpacity>
                ))}
              </>
            )}

            {filteredEvents.length > 0 && (
              <>
                <Text
                  style={{
                    color: theme.primary,
                    marginVertical: 4,
                    fontWeight: "bold",
                  }}
                >
                  Événements
                </Text>
                {filteredEvents.map((item) => (
                  <TouchableOpacity
                    key={`event-${item.id}`}
                    onPress={() => {
                      setQuery(item.nom);
                      setShowResults(false);
                      navigation.navigate("EventDetail", { eventId: item.id });
                    }}
                    style={{ padding: 6 }}
                  >
                    <Text style={{ color: theme.text }}>{item.nom}</Text>
                    <Text style={{ color: theme.text + "99", fontSize: 12 }}>
                      {item.terrain?.nom || "Terrain inconnu"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </View>
        )}
    </View>
  );
}
