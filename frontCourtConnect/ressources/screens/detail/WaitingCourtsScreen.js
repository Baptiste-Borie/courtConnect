import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { ThemeContext } from "../../context/ThemeContext"; 
import AuthContext from "../../context/AuthContext";
import WaitingCourt from "../../shared/WaitingCourt";
import PageLayout from '../../shared/PageLayout';

export default function WaitingCourtsScreen() {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  return (
    <PageLayout headerContent={"Terrains en attente"}>
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <WaitingCourt></WaitingCourt>
    </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
