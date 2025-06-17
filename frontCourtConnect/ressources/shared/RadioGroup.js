import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const RadioGroup = ({ options, selected, onChange, theme }) => {
  return (
    <View style={styles.group}>
      {options.map((option, index) => {
        const value = typeof option === "object" ? option.value : option;
        const label = typeof option === "object" ? option.label : option;
        const isSelected = selected === value;

        return (
          <TouchableOpacity
            key={value}
            onPress={() => onChange(value)}
            style={[
              styles.option,
              {
                borderColor: isSelected ? theme.primary : theme.text + "55",
                backgroundColor: isSelected ? theme.primary : "transparent",
              },
            ]}
          >
            <Text style={{ color: isSelected ? "#fff" : theme.text }}>
              {label}
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
