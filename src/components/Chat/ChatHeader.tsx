import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../theme/color";
import { hp, wp } from "../../helper/globalFunction";
import { BackIcon, ThreeDotIcon } from "../../theme/SvgIcon";
import { useNavigation } from "@react-navigation/native";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import FastImage from "react-native-fast-image";
import { api } from "../../helper/apiConstants";

type props = {
  name: string;
  status: string;
  isTyping: boolean;
  image: any;
};

const ChatHeader = ({ name, status, isTyping, image }: props) => {
  const { goBack, navigate } = useNavigation();
  const onPressBack = () => goBack();
  const { IMG_URL } = api;
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
              uri: `${IMG_URL}${image}`,
              priority: FastImage.priority.high,
            }}
          />
          {status === "Online" ? (
            <View style={styles.greenTickStyle} />
          ) : (
            <View style={styles.greyTickStyle} />
          )}
        </View>
        <View style={styles.cloumStyle}>
          <Text style={styles.nameTextStyle}>{name}</Text>
          <View style={{ height: hp(5) }} />
          {isTyping ? (
            <Text style={styles.onlienTextStyle}>{"Typing.."}</Text>
          ) : (
            <Text style={styles.onlienTextStyle}>{status}</Text>
          )}
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
    backgroundColor: colors.grey_19,
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
  greyTickStyle: {
    height: wp(14),
    width: wp(14),
    borderRadius: wp(wp(14 / 2)),
    position: "absolute",
    bottom: hp(-5),
    backgroundColor: colors.gery_3,
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
