import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";

import Header from "./nav/Header";
import Footer from "./nav/Footer";
import { ThemeContext } from "../context/ThemeContext";

const PageLayout = ({
  children,
  showHeader = true,
  showFooter = true,
  headerContent = null,
  onLogout = null,
  style = {},
  editMode = false,
  more = [],
}) => {
  const { theme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {showHeader && (
        <Header
          content={headerContent}
          onLogout={onLogout}
          editMode={editMode}
          more={more}
          onRefreshEvent={editMode?.refresh}
        />
      )}
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
