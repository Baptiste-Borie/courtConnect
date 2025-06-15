import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";

import Header from "./Header";
import Footer from "./Footer";
import { ThemeContext } from "../context/ThemeContext";

const PageLayout = ({
  children,
  showHeader = true,
  showFooter = true,
  style = {},
}) => {
  const { theme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {showHeader && <Header />}
      <View
        style={[styles.content, { backgroundColor: theme.background }, style]}
      >
        {children}
      </View>
      {showFooter && <Footer />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default PageLayout;
