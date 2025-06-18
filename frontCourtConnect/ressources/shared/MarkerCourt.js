import {useEffect, useRef} from 'react';
import { Marker, Callout  } from 'react-native-maps';
import { Image,View, Text} from 'react-native';
import assets from "../constants/assets";





const MarkerCourt = ({ marker, onPress, userLocation }) => {

  const coordinate = marker.coordinate; 

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  const distance = getDistance(
    userLocation.coordinate.latitude,
    userLocation.coordinate.longitude,
    marker.coordinate.latitude,
    marker.coordinate.longitude
  ).toFixed(2);

  const markerRef = useRef(null)

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.showCallout();
    }
  }, []);


  return (
    <Marker
      coordinate={coordinate}
      onPress={onPress}
      ref={markerRef}
    >
      <Image
        source={assets.courtMarkerOrange}
        style={{ width: 40, height: 40 }}
        resizeMode="contain"
      />
      <Callout>
        <View>
          <Text>{marker.title}</Text>
          <Text>{distance} km</Text>
        </View>
      </Callout>
    </Marker>
  );
};

export default MarkerCourt; 