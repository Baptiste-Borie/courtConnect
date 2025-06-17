import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ThemeContext } from "../../context/ThemeContext";

const StepTracker = ({ currentStep, onStepChange }) => {
  const { theme } = useContext(ThemeContext);

  const renderStep = (stepNumber) => {
    const isActive = currentStep === stepNumber;

    return (
      <TouchableOpacity
        onPress={() => {
          if (stepNumber !== currentStep && onStepChange) {
            onStepChange(stepNumber);
          }
        }}
      >
        <View
          style={[
            styles.step,
            {
              backgroundColor: isActive ? theme.primary : "transparent",
              borderColor: theme.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.stepText,
              {
                color: isActive ? theme.background : theme.primary,
              },
            ]}
          >
            {stepNumber}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {renderStep(1)}
      <View style={[styles.dashedLine, { borderColor: theme.primary }]} />
      {renderStep(2)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  step: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  stepText: {
    fontWeight: "bold",
  },
  dashedLine: {
    width: 50,
    height: 1,
    borderWidth: 1,
    borderStyle: "dashed",
    marginHorizontal: 5,
  },
});

export default StepTracker;
