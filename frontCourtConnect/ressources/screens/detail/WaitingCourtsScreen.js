import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import { ThemeContext } from "../../context/ThemeContext";
import WaitingCourt from "../../shared/WaitingCourt";
import PageLayout from '../../shared/PageLayout';

export default function WaitingCourtsScreen() {
    const { theme } = useContext(ThemeContext);


    return (
        <PageLayout headerContent={"Terrains en attente"}>
            <ScrollView>
                <View style={[styles.container, { backgroundColor: theme.background }]}>
                    <WaitingCourt></WaitingCourt>
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
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
    },
});
