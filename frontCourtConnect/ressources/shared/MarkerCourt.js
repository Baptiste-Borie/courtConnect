import React from 'react';
import { Marker } from 'react-native-maps';
import { Image } from 'react-native';

import { ThemeContext } from "../context/ThemeContext";
import assets from "../constants/assets";

export default function MarkerCourt({ coordinate, title, onPress }) {
  return (
    <Marker
      coordinate={coordinate}
      title={title}
      onPress={onPress}
    >
      <Image
        source={assets.courtMarkerOrange}
        style={{ width: 40, height: 40 }} 
        resizeMode="contain"
      />
    </Marker>
  );
}