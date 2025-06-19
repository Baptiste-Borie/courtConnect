import { useRef } from "react";
import { Marker } from "react-native-maps";
import { Image } from "react-native";

import assets from "../constants/assets";
import { recenterMarker } from '../utils/RecenterOnMarker';

const MarkerCourt = ({ marker, mapRef, onPress }) => {
  const markerRef = useRef(null);
  const coordinate = marker.coordinate;

  return (
    <Marker
      coordinate={coordinate}
      onPress={() => {
        recenterMarker(markerRef, mapRef, coordinate);
        onPress(marker); // déclenche l'ouverture de la modale
      }}
      ref={markerRef}
    >
      <Image
        source={assets.courtMarkerOrange}
        style={{ width: 40, height: 40 }}
        resizeMode="contain"
      />
    </Marker>
  );
};

export default MarkerCourt;
