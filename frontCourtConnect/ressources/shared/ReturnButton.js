import { TouchableOpacity, Text, StyleSheet } from "react-native";

const ReturnButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>← RETOUR</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "transparant",
    paddingVertical: 25,
    borderRadius: 25,
    position: "absolute",
    top: 50,
    left: 20,
  },
  text: {
    color: "#232543",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default ReturnButton;
