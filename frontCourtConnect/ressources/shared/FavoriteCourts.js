import React, { useContext, useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Image
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { ThemeContext } from "../context/ThemeContext";
import { authFetch } from "../utils/AuthFetch";
import { getTerrainImageUri } from "../utils/GetImage";
import assets from "../constants/assets";

export default function FavoriteCourts({ style }) {
    const { theme } = useContext(ThemeContext);
    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);
    const [courts, setCourts] = useState([]);
    const [imagesUriMap, setImagesUriMap] = useState({});

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const fetchCourts = async () => {
                try {
                    setLoading(true);
                    const res = await authFetch("/api/getAllFavoriteTerrains");
                    const data = await res.json();

                    if (isActive) {
                        setCourts(data);

                        const imagesMap = {};
                        await Promise.all(
                            data.map(async (terrain) => {
                                try {
                                    const uri = await getTerrainImageUri(terrain.id);
                                    imagesMap[terrain.id] = uri;
                                } catch (err) {
                                    console.error("Erreur image terrain :", err);
                                    imagesMap[terrain.id] = null;
                                }
                            })
                        );
                        setImagesUriMap(imagesMap);
                    }
                } catch (err) {
                    console.error("Erreur récupération terrains favoris :", err);
                } finally {
                    if (isActive) setLoading(false);
                }
            };

            fetchCourts();

            return () => {
                isActive = false;
            };
        }, [])
    );

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
                    <View
                        style={[styles.card, { backgroundColor: theme.background_light }]}
                    >
                        <View style={styles.headerRow}>
                            <View style={styles.terrainInfo}>
                                <Image
                                    source={{ uri: imagesUriMap[terrain.id] }}
                                    style={styles.terrainImage}
                                    resizeMode="cover"
                                />
                                <View style={styles.terrainText}>
                                    <Text style={[styles.name, { color: theme.text }]}>
                                        {terrain.nom}
                                    </Text>
                                    <Text style={[styles.info, { color: theme.text + "99" }]}>
                                        {terrain.adresse || "Adresse inconnue"}
                                    </Text>
                                </View>
                            </View>
                        </View>
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
        textAlign:"center"
    },
    card: {
        padding: 12,
        borderRadius: 8,
        elevation: 2,
        marginBottom: 12,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    terrainInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    terrainImage: {
        width: 60,
        height: 60,
        borderRadius: 6,
        marginRight: 12,
    },
    terrainText: {
        flex: 1,
    },
    name: {
        fontWeight: "bold",
        fontSize: 16,
    },
    info: {
        fontSize: 12,
        marginTop: 4,
    },
});
