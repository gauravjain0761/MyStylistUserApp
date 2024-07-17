import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import {
  Checkmark,
  ClockIcon,
  GreenClock,
  SquareTresh,
  TrashIcon,
} from "../../theme/SvgIcon";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";
import { hp, wp } from "../../helper/globalFunction";

type service = {
  service?: string;
  selected?: boolean;
  onPress?: () => void;
  type?: "select" | "delete";
};

const ServiceSelect = ({
  service,
  selected,
  onPress = () => {},
  type,
}: service) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View>
        <Text style={styles.title}>{service}</Text>
      </View>
      {type == "delete" ? (
        <TouchableOpacity onPress={onPress}>
          <SquareTresh />
        </TouchableOpacity>
      ) : selected ? (
        <View style={styles.selectedbutton}>
          <Checkmark />
        </View>
      ) : (
        <View style={styles.radiobtn}></View>
      )}
    </TouchableOpacity>
  );
};

export default ServiceSelect;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  time: {
    ...commonFontStyle(fontFamily?.medium, 12, colors?.green_2),
  },
  timecomponent: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(3),
  },
  title: {
    ...commonFontStyle(fontFamily.semi_bold, 16, colors?.black),
    marginBottom: hp(9),
  },
  radiobtn: {
    width: wp(22),
    height: wp(22),
    borderColor: colors?.grey_23,
    borderWidth: 1.4,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedbutton: {
    backgroundColor: colors?.primary_light_blue,
    width: wp(22),
    height: wp(22),
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});
