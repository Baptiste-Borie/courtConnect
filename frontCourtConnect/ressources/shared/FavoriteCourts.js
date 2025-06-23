import React, { useContext, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../context/ThemeContext";
import { authFetch } from "../utils/AuthFetch";
import assets from "../constants/assets";

export default function FavoriteCourts({ style }) {
    const { theme } = useContext(ThemeContext);
    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);
    const [courts, setCourts] = useState([]);

    useEffect(() => {
        const fetchCourts = async () => {
            try {
                const res = await authFetch("/api/getAllFavoriteTerrains");
                const data = await res.json();
                setCourts(data);
            } catch (err) {
                console.error("Erreur récupération terrains favoris :", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourts();
    }, []);

    if (loading) {
        return (
            <View style={[styles.container, style]}>
                <Text style={[styles.title, { color: theme.text }]}>
                    Chargement des terrains favoris...
                </Text>
                <ActivityIndicator color={theme.primary} />
            </View>
        );
    }

    if (courts.length === 0) {
        return (
            <View style={[styles.container, style]}>
                <Text style={[styles.title, { color: theme.text }]}>
                    Vous n'avez aucun terrain en favori pour le moment.
                </Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, style]}>
            <Text style={[styles.title, { color: theme.text }]}>
                Terrains Favoris ({courts.length})
            </Text>

            {courts.map((terrain) => (
                <TouchableOpacity
                    key={`terrain-${terrain.id}`}
                    onPress={() =>
                        navigation.navigate("TerrainDetail", { terrainId: terrain.id })
                    }
                >
                    <View style={[styles.card, { backgroundColor: theme.background_light }]}>
                        <Text style={[styles.name, { color: theme.text }]}>
                            {terrain.nom}
                        </Text>

                        <Text style={[styles.info, { color: theme.text + "99" }]}>
                            {terrain.adresse || "Adresse inconnue"}
                        </Text>

                        {terrain.created_by && (
                            <View style={{ alignItems: "flex-end" }}>
                                <Text style={[styles.info, { color: theme.text + "99" }]}>
                                    Ajouté par :{" "}
                                    {terrain.created_by.prenom && terrain.created_by.nom
                                        ? `${terrain.created_by.prenom} ${terrain.created_by.nom}`
                                        : "Inconnu"}
                                </Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    card: {
        padding: 12,
        borderRadius: 8,
        elevation: 2,
    },
    name: {
        fontWeight: "bold",
        fontSize: 16,
    },
    info: {
        fontSize: 12,
        marginTop: 4,
        justifyContent: "flex-end",
    },
    heartIcon: {
        width: 20,
        height: 20,
        marginLeft: 4,
    },
});
