import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { ThemeContext } from "../context/ThemeContext";
import AuthContext from "../context/AuthContext";
import PageLayout from "../shared/PageLayout";
import FavoriteCourts from "../shared/FavoriteCourts";

export default function FavoriteCourtsScreen() {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  const isPremium = user?.roles?.includes("ROLE_PREMIUM");

  useEffect(() => {
    if (!isPremium) {
      navigation.replace("SubscribeScreen");
    }
  }, [isPremium, navigation]);
  
  return (
    <PageLayout headerContent={"Terrains favoris"}>
      <ScrollView>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          {isPremium && <FavoriteCourts />}
        </View>
      </ScrollView>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
