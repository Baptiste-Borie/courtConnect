import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { ThemeContext } from "../../context/ThemeContext";
import assets from "../../constants/assets";

export default function AccountScreenHeader({ data }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { theme } = useContext(ThemeContext);

  if (!data) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.background_light }]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.background_light }]}
    >
      <View style={styles.headerTop}>
        <View style={styles.avatarContainer}>
          <Image
            source={
              data.profilePicture
                ? { uri: data.profilePicture }
                : assets.icons.account
            }
            style={styles.avatar}
          />
        </View>

        <View style={styles.content}>
          <View style={styles.info}>
            <Text style={[styles.name, { color: theme.text }]}>
              {data.nom} {data.prenom}
            </Text>
          </View>

          <View style={styles.trustContainer}>
            <Text style={[styles.trustLabel, { color: theme.primary }]}>
              Réputation : {data.trustability}/100
            </Text>

            <View style={styles.trustRow}>
              <View
                style={[
                  styles.trustBarBackground,
                  { backgroundColor: theme.text + "33" },
                ]}
              >
                <View
                  style={[
                    styles.trustBarFill,
                    {
                      width: `${data.trustability}%`,
                      backgroundColor: theme.primary,
                    },
                  ]}
                />
              </View>

              <TouchableOpacity onPress={() => setShowTooltip(!showTooltip)}>
                <Image
                  source={assets.icons.info_active}
                  style={styles.trustIcon}
                />
              </TouchableOpacity>

              {showTooltip && (
                <View
                  style={[
                    styles.tooltip,
                    {
                      backgroundColor: theme.background,
                      shadowColor: theme.text,
                    },
                  ]}
                >
                  <Text style={[styles.tooltipText, { color: theme.text }]}>
                    La réputation augmente en créant {"\n"}et en participant à
                    des événements.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 50,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    gap: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  trustContainer: {
    gap: 4,
  },
  trustLabel: {
    fontSize: 14,
  },
  trustRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  trustBarBackground: {
    height: 6,
    borderRadius: 3,
    flex: 1,
  },
  trustBarFill: {
    height: 6,
    borderRadius: 3,
  },
  trustIcon: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },

  tooltip: {
    position: "absolute",
    bottom: -50,
    right: 10,
    padding: 8,
    borderRadius: 6,
    maxWidth: 250,
    zIndex: 10,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  tooltipText: {
    fontSize: 12,
    flexWrap: "wrap",
    lineHeight: 16,
  },
});
