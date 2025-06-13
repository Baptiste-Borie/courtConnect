import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "./Header";
import Footer from "./Footer";
import colors from "../style/color";

const PageLayout = ({
  children,
  showHeader = true,
  showFooter = true,
  style = {},
}) => {
  return (
    <View style={styles.container}>
      {showHeader && <Header />}
      <View style={[styles.content, style]}>{children}</View>
      {showFooter && <Footer />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F21",
  },
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.darkBlue,
  },
});

export default PageLayout;
