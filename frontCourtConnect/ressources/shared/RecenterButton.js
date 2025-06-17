import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useContext } from 'react';
import { ThemeContext } from "../context/ThemeContext";

const RecenterButton = ({ mapRef, latitude, longitude }) => {

  const { themeName, theme } = useContext(ThemeContext);
    const handlePress = () => {
        if (mapRef?.current && latitude && longitude) {
            mapRef.current.animateToRegion(
                {
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                },
                1000
            );
        }
    };

    return (
        <TouchableOpacity style={[styles.recenterButton, {backgroundColor : theme.background}]} onPress={handlePress}>
            <Ionicons name="locate" size={24}  color={theme.primary}/>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    recenterButton: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        borderRadius: 24,
        padding: 12,
        zIndex: 1000,
    },
});

export default RecenterButton;
