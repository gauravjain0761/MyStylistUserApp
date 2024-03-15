import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { hp, wp } from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { images } from "../../theme/icons";

type props = {
  data: any;
  onPress?: (value?: number) => void;
  selectIndex: number;
  index: number;
};

const OvalShapView = ({ data, onPress, selectIndex, index }: props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btn_conatiner}
        onPress={() => onPress(index)}
      >
        <ImageBackground
          source={
            selectIndex === index
              ? images.blue_border_button
              : images.oval_grey_button
          }
          style={styles.oval_bg}
          resizeMode="stretch"
          resizeMethod="scale"
        >
          <Text style={styles?.title}>{data?.title}</Text>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

export default OvalShapView;

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
    paddingTop: hp(10),
    paddingBottom: hp(10),
    paddingHorizontal: wp(15),
    gap: wp(5),
    marginLeft: wp(7),
  },
});
