import React, {
  forwardRef,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import { View, StyleSheet, Dimensions, Image } from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";

import { ThemeContext } from "../context/ThemeContext";
import assets from "../constants/assets";
import MarkerCourt from "./MarkerCourt";
import { recenterMarker } from "../utils/RecenterOnMarker";
import CourtModal from "./CourtModal";

const MapBox = forwardRef(
  (
    {
      style = {},
      height = 200,
      region,
      centerMaker = false,
      userLocation,
      terrainMarkers = [],
      onRegionChange = () => {},
      navigation,
    },
    ref
  ) => {
    const { themeName } = useContext(ThemeContext);

    const userMarkerRef = useRef(null);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    return (
      <View style={[{ flex: 1 }, { height }, style]}>
        <MapView
          ref={ref}
          style={StyleSheet.absoluteFill}
          userInterfaceStyle={themeName}
          key={terrainMarkers
            .map((m) => m.coordinate.latitude + "," + m.coordinate.longitude)
            .join("|")}
          initialRegion={region}
          onRegionChangeComplete={onRegionChange}
        >
          {userLocation && (
            <Marker
              coordinate={userLocation.coordinate}
              title={userLocation.title}
              pinColor="blue"
              onPress={() =>
                recenterMarker(userMarkerRef, ref, userLocation.coordinate)
              }
              ref={userMarkerRef}
            />
          )}
          {terrainMarkers.map((marker, index) => {
            return (
              <MarkerCourt
                key={index}
                userLocation={userLocation}
                marker={marker}
                mapRef={ref}
                navigation={navigation}
                onPress={(marker) => {
                  setSelectedMarker(marker);
                  setModalVisible(true);
                }}
              ></MarkerCourt>
            );
          })}
        </MapView>
        <CourtModal
          visible={modalVisible}
          marker={selectedMarker}
          onClose={() => setModalVisible(false)}
          onNavigate={() => {
            setModalVisible(false);
            navigation.navigate("EventFormulaire");
          }}
          userLocation={userLocation}
        />
        {centerMaker && (
          <View style={styles.markerFixed}>
            <Image source={assets.icons.marker} style={styles.marker} />
          </View>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  markerFixed: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -12,
    marginTop: -24,
  },
  marker: {
    width: 48,
    height: 48,
  },
});

export default MapBox;
