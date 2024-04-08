import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../theme/color";
import { hp, wp } from "../../helper/globalFunction";
import { BackIcon, ThreeDotIcon } from "../../theme/SvgIcon";
import { useNavigation } from "@react-navigation/native";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import FastImage from "react-native-fast-image";

const ChatHeader = () => {
  const { goBack, navigate } = useNavigation();

  const onPressBack = () => goBack();
  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <TouchableOpacity onPress={onPressBack}>
        <BackIcon />
      </TouchableOpacity>
      <View style={styles.rowSpaceStyle}>
        <View style={styles.circleStyle}>
          <FastImage
            style={styles.imgStyle}
            source={{
              uri: "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg",
              priority: FastImage.priority.high,
            }}
          />
          <View style={styles.greenTickStyle} />
        </View>
        <View style={styles.cloumStyle}>
          <Text style={styles.nameTextStyle}>{"Majid Khan"}</Text>
          <View style={{ height: hp(5) }} />
          <Text style={styles.onlienTextStyle}>{"Online"}</Text>
        </View>
        <TouchableOpacity style={{ marginRight: wp(20) }}>
          <ThreeDotIcon />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(10),
    paddingHorizontal: wp(20),
    backgroundColor: colors.white,
  },
  imgStyle: {
    height: wp(40),
    width: wp(40),
    borderRadius: wp(40 / 2),
  },
  circleStyle: {
    width: wp(45),
    height: wp(45),
    borderWidth: 1.5,
    alignItems: "center",
    borderRadius: wp(45 / 2),
    justifyContent: "center",
    borderColor: colors.primary_light_blue,
  },
  cloumStyle: {
    flex: 1,
    marginLeft: wp(12),
  },
  rowSpaceStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  greenTickStyle: {
    height: wp(14),
    width: wp(14),
    borderRadius: wp(wp(14 / 2)),
    position: "absolute",
    bottom: hp(-5),
    backgroundColor: "#43F174",
    borderWidth: 2,
    borderColor: colors.white,
    alignSelf: "flex-end",
  },
  nameTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 14, colors.black),
  },
  onlienTextStyle: {
    ...commonFontStyle(fontFamily.regular, 12, colors.gery_6),
  },
});

export default ChatHeader;
