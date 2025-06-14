import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

const MapBox = ({ width = "100%", height = 200, region, markers = [] }) => {
  return (
    <View style={{ width, height }}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={
          region || {
            latitude: 48.8566, // C'est centré sur Paris par défaut mais je te laisse le changer
            longitude: 2.3522,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }
        }
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
          />
        ))}
      </MapView>
    </View>
  );
};

export default MapBox;
