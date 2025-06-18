import { useEffect, useRef } from 'react';
import { Marker, Callout } from 'react-native-maps';
import { Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import des icônes

import assets from "../constants/assets";
import { getDistance } from '../utils/GetDistance';
import { recenterMarker } from '../utils/RecenterOnMarker';


const MarkerCourt = ({ marker, userLocation, mapRef  }) => {
  const coordinate = marker.coordinate;
  const markerRef = useRef(null);
  const distance = userLocation ? getDistance(
    userLocation.coordinate.latitude,
    userLocation.coordinate.longitude,
    marker.coordinate.latitude,
    marker.coordinate.longitude
  ).toFixed(2) : 'N/A';

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.showCallout();
    }
  }, []);

  return (
    <Marker
      coordinate={coordinate}
      onPress={() => recenterMarker(markerRef, mapRef, coordinate)}
      ref={markerRef}
    >
      <Image
        source={assets.courtMarkerOrange}
        style={{ width: 40, height: 40 }}
        resizeMode="contain"
      />
      <Callout style={styles.callout}>
        <View style={styles.content}>
          <Text>{marker.title}</Text>
          <Text>{distance} km</Text>
        </View>
        <View style={styles.viewButton}>
          <TouchableOpacity title="Evenements">
            <Text style={styles.buttonText}>Voir les événements</Text>
          </TouchableOpacity>
        </View>
      </Callout>
    </Marker>
  );
};

const styles = StyleSheet.create({
  callout: {
    minWidth: 200,
    height: 60,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  viewButton: {
    alignItems: 'center'
  },
});

export default MarkerCourt;