import React, { useContext } from 'react';
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

export default function SubscribeScreen() {
  const { theme } = useContext(ThemeContext);

  return (
    <PageLayout headerContent={"Premium"}>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
        <Image source={assets.players} style={styles.image} resizeMode="cover" />
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.primary }]}>Passez au premium !</Text>

          <Text style={[styles.benefit, { color: theme.text }]}>✓ Obtenez d’office le maximum de réputation</Text>
          <Text style={[styles.benefit, { color: theme.text }]}>✓ Création d’événements en illimité</Text>
          <Text style={[styles.benefit, { color: theme.text }]}>✓ Ajoutez des terrains en favoris</Text>
          <Text style={[styles.benefit, { color: theme.text }]}>✓ Ajout de terrains en illimité</Text>
          <Text style={[styles.benefit, { color: theme.text }]}>✓ Plus de publicités</Text>

          <Text style={[styles.price, { color: theme.primary }]}>2,99€ / mois</Text>

          <TouchableOpacity style={[styles.subscribeButton, {backgroundColor: theme.primary}]}>
            <Text style={styles.subscribeButtonText}>S'abonner</Text>
          </TouchableOpacity>
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
});
