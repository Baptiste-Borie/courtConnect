import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import colors from "../../constants/color";
import assets from "../../constants/assets";

export default function AccountScreenHeader() {
  const data = {
    name: "Allen Iverson",
    age: 22,
    city: "Paris",
    trustability: 65,
    profilePicture: null,
  };

  return (
    <View style={styles.container}>
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
            <Text style={styles.name}>{data.name}</Text>
            <Text style={styles.ageCity}>
              {data.age} ans{"\n"}
              {data.city}
            </Text>
          </View>

          <View style={styles.trustContainer}>
            <Text style={styles.trustLabel}>
              Réputation : {data.trustability}/100
            </Text>

            <View style={styles.trustRow}>
              <View style={styles.trustBarBackground}>
                <View
                  style={[
                    styles.trustBarFill,
                    { width: `${data.trustability}%` },
                  ]}
                />
              </View>
              <Image
                source={assets.icons.info_active}
                style={styles.trustIcon}
              />
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
    backgroundColor: colors.lightBlue,
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
    color: colors.white,
  },
  ageCity: {
    color: colors.white,
    fontSize: 14,
    marginTop: 2,
  },
  trustContainer: {
    gap: 4,
  },
  trustLabel: {
    color: colors.orange,
    fontSize: 14,
  },
  trustRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  trustBarBackground: {
    height: 6,
    backgroundColor: colors.white,
    borderRadius: 3,
    flex: 1,
  },
  trustBarFill: {
    height: 6,
    backgroundColor: colors.orange,
    borderRadius: 3,
  },
  trustIcon: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
});
