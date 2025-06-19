import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
} from 'react-native';
import PageLayout from '../shared/PageLayout';
import { ThemeContext } from "../context/ThemeContext";
import assets from '../constants/assets';
import { authFetch } from "../utils/AuthFetch";
import Button from '../shared/Button';
import AuthContext from '../context/AuthContext';

export default function SubscribeScreen() {
    const { theme } = useContext(ThemeContext);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const { user, setUser } = useContext(AuthContext);

    const isPremium = user?.roles?.includes("ROLE_PREMIUM");

    const handleSubscribe = async () => {
        const route = isPremium ? "/api/unsubscribe" : "/api/subscribe";

        try {
            const res = await authFetch(route, {
                method: "POST",
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message || "Opération réussie !");
                setError(null);
                const userRes = await authFetch("/api/userConnected");
                if (userRes.ok) {
                    const userData = await userRes.json();
                    setUser(userData);
                } else {
                    setUser(null);
                }
            } else {
                setMessage(null);
                setError(data.message || "Erreur durant l’opération");
            }

        } catch (err) {
            console.error("Erreur :", err);
            setMessage(null);
            setError("Une erreur est survenue. Veuillez réessayer.");
        }
    };

    return (
        <PageLayout headerContent={"Premium"}>
            <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
                <Image source={assets.players} style={styles.image} resizeMode="cover" />

                <View style={styles.content}>
                    <Text style={[styles.title, { color: theme.primary }]}>
                        {isPremium ? "Merci pour votre soutien ❤️" : "Passez au premium !"}
                    </Text>

                    {isPremium ? (
                        <Text style={[styles.benefit, { color: theme.text, fontStyle: "italic", marginBottom: 20 }]}>
                            Vous êtes déjà membre premium. Merci de soutenir notre projet !
                        </Text>
                    ) : (
                        <>
                            <Text style={[styles.benefit, { color: theme.text }]}>✓ Obtenez d’office le maximum de réputation</Text>
                            <Text style={[styles.benefit, { color: theme.text }]}>✓ Création d’événements en illimité</Text>
                            <Text style={[styles.benefit, { color: theme.text }]}>✓ Ajoutez des terrains en favoris</Text>
                            <Text style={[styles.benefit, { color: theme.text }]}>✓ Ajout de terrains en illimité</Text>
                            <Text style={[styles.benefit, { color: theme.text }]}>✓ Plus de publicités</Text>
                            <Text style={[styles.price, { color: theme.primary }]}>2,99€ / mois</Text>
                        </>
                    )}

                    {message && <Text style={[styles.success, { color: "green" }]}>{message}</Text>}
                    {error && <Text style={[styles.error, { color: "red" }]}>{error}</Text>}

                    <Button
                        style={[styles.subscribeButton, { backgroundColor: theme.primary }]}
                        onPress={handleSubscribe}
                        title={isPremium ? "Se désabonner" : "S'abonner"}
                    >
                        <Text style={styles.subscribeButtonText}>
                            {isPremium ? "Se désabonner" : "S'abonner"}
                        </Text>
                    </Button>
                </View>
            </ScrollView>
        </PageLayout>
    );
}


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingBottom: 32,
    },
    image: {
        width: '100%',
        height: 200,
    },
    content: {
        marginTop: 24,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    benefit: {
        fontSize: 16,
        marginVertical: 4,
        textAlign: 'center',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
    subscribeButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
    },
    subscribeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    success: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    error: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});
