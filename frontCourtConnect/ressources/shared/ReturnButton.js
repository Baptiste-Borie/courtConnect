import { TouchableOpacity, Text, StyleSheet } from "react-native";

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
    color: "#232543",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default ReturnButton;
