import { StyleSheet, Text, View, ViewStyle } from "react-native";
import React from "react";

type props = {
  type: "with Service" | "Without Service";
  name: string;
  rating?: string;
  onPress?: () => void;
  containerStyle?: ViewStyle;
  location?: string;
  service?: string;
  price?: string;
};
const Barber_Card = ({}: props) => {
  return (
    <View>
      <Text>Barber_Card</Text>
    </View>
  );
};

export default Barber_Card;

const styles = StyleSheet.create({});
