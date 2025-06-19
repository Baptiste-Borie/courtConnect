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
                <TouchableOpacity
                    key={terrain.id}
                    style={[styles.card, { backgroundColor: theme.background_light }]}
                    onPress={() =>
                        navigation.navigate("CourtDetail", { terrainId: terrain.id })
                    }
                >
                    <View>
                        <Text style={[styles.name, { color: theme.text }]}>{terrain.nom}</Text>
                        <Text style={[styles.info, { color: theme.text + "99" }]}>
                            {terrain.adresse || "Adresse inconnue"}
                        </Text>
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
    },
});
