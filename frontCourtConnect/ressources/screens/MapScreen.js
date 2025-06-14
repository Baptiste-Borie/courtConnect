import { StyleSheet } from "react-native";

import MapBox from "../shared/MapBox";
import ReturnButton from "../shared/ReturnButton";
import PageLayout from "../shared/PageLayout";
import colors from "../style/color";

const MapScreen = ({ navigation }) => {
  return (
    <PageLayout style={styles.container}>
      <MapBox height="100%" />
      <ReturnButton
        onPress={() => {
          navigation.navigate("Home");
        }}
      />
    </PageLayout>
  );
};

//ReturnButton à enlever quand le layout sera pret

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors,
  },
});

export default MapScreen;
