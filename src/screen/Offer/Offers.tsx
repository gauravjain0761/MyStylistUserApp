import React from "react";
import { StyleSheet, View, Text } from "react-native";

const Offers = () => {
  return (
    <View style={styles.container}>
      <Text>{"Offers"}</Text>
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

export default Offers;
