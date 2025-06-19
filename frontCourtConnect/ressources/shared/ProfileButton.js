import React, { useEffect, useState } from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { getUserImageUri } from "../utils/GetImage";

const ProfileButton = ({ style }) => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      const uri = await getUserImageUri();
      setProfileImage(uri);
    };

    fetchImage();
  }, []);

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={() => navigation.navigate("Account")}
    >
      <Image source={{ uri: profileImage }} style={styles.icon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
  icon: {
    width: 48,
    height: 48,
    resizeMode: "contain",
    borderRadius: 24,
  },
});

export default ProfileButton;
