import { StyleSheet } from "react-native";

import MapBox from "../shared/MapBox";
import PageLayout from "../shared/PageLayout";

const MapScreen = ({ navigation }) => {
  return (
    <PageLayout style={styles.container} showHeader={false}>
      <MapBox height="100%" />
    </PageLayout>
  );
};

//ReturnButton à enlever quand le layout sera pret

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MapScreen;
