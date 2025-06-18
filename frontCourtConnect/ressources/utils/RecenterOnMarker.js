export const recenterMarker = (markerRef, mapRef, coordinate) => {
  if (markerRef?.current) {
    markerRef.current.showCallout();
  }

  if (mapRef?.current && coordinate) {
    mapRef.current.animateToRegion(
      {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      500
    );
  }
};
