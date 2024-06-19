import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { hp, wp } from "../../helper/globalFunction";
import { MarkReadIcon } from "../../theme/SvgIcon";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";
import FastImage from "react-native-fast-image";
import moment from "moment";

type props = {
  index: number;
  onPressItem?: () => void;
  data: any;
};

const MessageItem = ({ index, onPressItem, data }: props) => {
  const { image } = data?.user_profile_images?.[0];
  return (
    <TouchableOpacity onPress={onPressItem} style={styles.container}>
      <FastImage
        source={{
          uri: image,
          priority: FastImage.priority.high,
        }}
        style={styles.imageStyle}
      />
      <View style={{ marginLeft: wp(10), flex: 1 }}>
        <View style={styles.rowStyle}>
          <Text style={styles.nameTextStyle}>{data?.name || "Dummy Name"}</Text>
          <Text style={styles.timeTextStyle}>
            {data?.time ? moment(data?.time).format("HH:MM") : "04:43"}
          </Text>
        </View>
        <View style={{ flex: 1 }} />
        <View style={styles.rowStyle}>
          <Text numberOfLines={2} style={styles.greyTxtStyle}>
            {data?.lastMessage}
          </Text>
          {/* {index === 1 ? (
            <View style={styles.circleStyle}>
              <Text style={styles.countTextStyle}>{"5"}</Text>
            </View>
          ) : (
            <MarkReadIcon color="#2BE8D9" />
          )} */}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: wp(20),
  },
  imageStyle: {
    height: wp(50),
    width: wp(50),
    borderRadius: wp(50 / 2),
    backgroundColor: colors.grey_19,
  },
  rowStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nameTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black),
    marginTop: hp(5),
  },
  timeTextStyle: {
    ...commonFontStyle(fontFamily.regular, 13, colors.grey_18),
  },
  greyTxtStyle: {
    ...commonFontStyle(fontFamily.regular, 16, colors.gery_6),
    marginBottom: hp(5),
  },
  circleStyle: {
    height: hp(20),
    backgroundColor: colors.primary_light_blue,
    width: "auto",
    paddingHorizontal: wp(6),
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  countTextStyle: {
    ...commonFontStyle(fontFamily.regular, 12, colors.black_2),
  },
});

export default MessageItem;
