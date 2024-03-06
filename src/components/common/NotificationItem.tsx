import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { wp } from "../../helper/globalFunction";

const NotificationItem = () => {
  return <View style={styles.conatiner}></View>;
};

const styles = StyleSheet.create({
  conatiner: {
    borderWidth: 1,
    paddingHorizontal: wp(20),
  },
});

export default NotificationItem;
