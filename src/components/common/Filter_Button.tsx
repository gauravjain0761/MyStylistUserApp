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
import { images } from "../../theme/icons";

type props = {
  title: string;
  type: "icon" | "simple";
  onPress?: (arg?: any) => any;
  containerStyle?: ViewStyle | any;
};

const Filter_Button = ({ title, type, onPress, containerStyle }: props) => {
  return (
    <>
      {type === "icon" ? (
        <View style={styles.container}>
          <TouchableOpacity
            style={[styles.btn_conatiner, containerStyle]}
            onPress={onPress}
          >
            <ImageBackground
              source={images.oval_grey_button}
              style={styles.oval_bg}
              resizeMode="stretch"
            >
              <Text style={styles.title}>{title}</Text>
              <Dropdown_Down_Arrow />
            </ImageBackground>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.container}>
          <TouchableOpacity
            style={[styles.btn_conatiner, containerStyle]}
            onPress={onPress}
          >
            <ImageBackground
              source={images.oval_grey_button}
              style={styles.oval_bg}
              resizeMode="stretch"
              resizeMethod="scale"
            >
              <Text style={styles?.title}>{title}</Text>
            </ImageBackground>
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
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    ...commonFontStyle(fontFamily.medium, 13, colors?.stylists_title_gray),
  },
  oval_bg: {
    width: "auto",
    alignSelf: "flex-start",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingTop: hp(9),
    paddingBottom: hp(10),
    paddingHorizontal: wp(8),
    gap: wp(5),
  },
});
