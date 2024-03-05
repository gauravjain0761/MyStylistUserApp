import React from "react";
import { StyleSheet, View, Text } from "react-native";

const Packages = () => {
  return (
    <View style={styles.container}>
      <Text>{"Packages"}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Packages;
