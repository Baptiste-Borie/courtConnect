import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Location from 'expo-location'

export default function useLocation() {
    const [errorMsg, setErrorMsg] = useState("");
    const [longitude, setLongitude] = useState("");
    const [latitude, setLatitude] = useState("");

    const getUserLocation = async () => {
        let {status} = await Location.requestForegroundPermissionsAsync(); 

        if (status !== 'granted') {
            setErrorMsg("La permission d'accès à la localisation n'a pas été accordé");
            return;
        }

        let {coords} = await Location.getCurrentPositionAsync();

        if (coords) {
            const {latitude, longitude} = coords;
            console.log('lat and long are', latitude, longitude); 
            setLatitude(latitude); 
            setLongitude(longitude); 
            let response = await Location.reverseGeocodeAsync({
                latitude,
                longitude
            })

            console.log("USER LOCATION IS", response);
        }
    }

    useEffect(() => {
        getUserLocation();
    }, [])

    return {latitude,longitude, errorMsg}
}