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

export default function WaitingCourtScreen({ style }) {
    const { theme } = useContext(ThemeContext);
    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);
    const [courts, setCourts] = useState([]);

    const handleValidation = async (terrainId, action) => {
        try {
            await authFetch(`/api/terrain/${terrainId}/${action}`, {
                method: "POST",
            });
            setCourts((prev) => prev.filter((t) => t.id !== terrainId));
        } catch (err) {
            console.error(`Erreur lors de la ${action} du terrain ${terrainId} :`, err);
        }
    };


    useEffect(() => {
        const fetchCourts = async () => {
            try {
                const res = await authFetch("/api/getAllNoVotedTerrains");
                const data = await res.json();
                setCourts(data);
            } catch (err) {
                console.error("Erreur récupération terrains :", err);
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
                    Chargement des terrains en attente...
                </Text>
                <ActivityIndicator color={theme.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, style]}>
            <Text style={[styles.title, { color: theme.text }]}>
                Terrains en attente de validation ({courts.length})
            </Text>
            {courts.map((terrain) => (
                <View
                    key={terrain.id}
                    style={[styles.card, { backgroundColor: theme.background_light }]}
                >
                    <View style={styles.headerRow}>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("CourtDetail", { terrainId: terrain.id })
                            }
                        >
                            <Text style={[styles.name, { color: theme.text }]}>
                                {terrain.nom}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.actions}>
                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={() => handleValidation(terrain.id, "validate")}
                            >
                                <Text style={{ color: "green", fontSize: 18 }}>✓</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={() => handleValidation(terrain.id, "refuse")}
                            >
                                <Text style={{ color: "red", fontSize: 18 }}>✗</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
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
    },
});
