import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { hp, wp } from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import { Dropdown_Down_Arrow } from "../../theme/SvgIcon";
import { commonFontStyle, fontFamily } from "../../theme/fonts";

type props = {
  title: string;
  type: "icon" | "simple";
  onPress?: (arg?: any) => any;
  containerStyle?: ViewStyle;
};

const Filter_Button = ({ title, type, onPress, containerStyle }: props) => {
  return (
    <>
      {type === "icon" ? (
        <View style={styles.container}>
          <TouchableOpacity style={styles.btn_conatiner} onPress={onPress}>
            <Text style={styles.title}>{title}</Text>
            <Dropdown_Down_Arrow />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.container}>
          <TouchableOpacity style={styles.btn_conatiner} onPress={onPress}>
            <Text style={styles?.title}>{title}</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default Filter_Button;

const styles = StyleSheet.create({
  container: {},
  btn_conatiner: {
    borderWidth: wp(1),
    borderColor: colors?.light_gray_border,
    width: "auto",
    alignSelf: "flex-start",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingTop: hp(9),
    paddingBottom: hp(10),
    paddingHorizontal: wp(10),
    borderRadius: wp(10),
    gap: wp(5),
    backgroundColor: colors?.white,
  },
  title: {
    ...commonFontStyle(fontFamily.medium, 13, colors?.stylists_title_gray),
  },
});
