import { TouchableOpacity, Text, StyleSheet } from "react-native";
import colors from "../constants/color";

const ReturnButton = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.text}>← RETOUR</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "transparant",
  },
  text: {
    color: colors.darkBlue,
    fontSize: 16,
    fontWeight: "500",
  },
});

export default ReturnButton;
