import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const RadioGroup = ({ options, selected, onChange, theme }) => {
  return (
    <View style={styles.group}>
      {options.map((option) => {
        const isSelected = selected === option;

        return (
          <TouchableOpacity
            key={option}
            onPress={() => onChange(option)}
            style={[
              styles.option,
              {
                borderColor: isSelected ? theme.primary : theme.text + "55",
                backgroundColor: isSelected ? theme.primary : "transparent",
              },
            ]}
          >
            <Text style={{ color: isSelected ? "#fff" : theme.text }}>
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  group: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
});

export default RadioGroup;
