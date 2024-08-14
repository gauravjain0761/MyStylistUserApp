import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { hp, wp } from "../../helper/globalFunction";
import { MarkReadIcon } from "../../theme/SvgIcon";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";
import FastImage from "react-native-fast-image";
import moment from "moment";
import { api } from "../../helper/apiConstants";

type props = {
  index: number;
  onPressItem?: () => void;
  data: any;
  unreadMessageCount: number;
};

const MessageItem = ({
  index,
  onPressItem,
  data,
  unreadMessageCount = 0,
}: props) => {
  const image =
    data?.user_profile_images?.filter((images) => images?.is_featured == 1)?.[0]
      ?.image || {};
  const { IMG_URL } = api;
  const { lastMessage, name, time, user_profile_images } = data || {};
  return (
    <TouchableOpacity onPress={onPressItem} style={styles.container}>
      <FastImage
        source={{
          uri: `${IMG_URL}${image}`,
          priority: FastImage.priority.high,
        }}
        style={styles.imageStyle}
      />
      <View
        style={{
          marginLeft: wp(10),
          flexDirection: "row",
          flex: 1,
          alignItems: "center",
        }}
      >
        <View style={styles.nameView}>
          <Text style={styles.nameTextStyle}>{name || "Unknown User"}</Text>
          {lastMessage && (
            <Text numberOfLines={2} style={styles.greyTxtStyle}>
              {lastMessage}
            </Text>
          )}
        </View>
        <View style={{ flex: 1 }} />
        <View style={styles.timeview}>
          {time && (
            <Text style={styles.timeTextStyle}>
              {time ? moment(time).format("hh:mm") : ""}
            </Text>
          )}
          {lastMessage && unreadMessageCount == 0 && (
            <MarkReadIcon color="#2BE8D9" />
          )}
          {unreadMessageCount > 0 && (
            <View style={styles.circleStyle}>
              <Text style={styles.countTextStyle}>{unreadMessageCount}</Text>
            </View>
          )}
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
  nameView: {
    flex: 1,
    justifyContent: "center",
  },
  timeview: {
    alignItems: "center",
    gap: hp(5),
  },
});

export default MessageItem;
