import React, { FC } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { hp, wp } from "../../helper/globalFunction";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";
import FastImage from "react-native-fast-image";
import moment from "moment";

type card = {
  name?: string;
  time?: string;
  message?: string;
  image?: string;
};

const NotificationItem: FC<card> = ({ image, message, name, time }) => {
  return (
    <View style={styles.conatiner}>
      <FastImage
        resizeMode="cover"
        style={styles.imgStyle}
        source={{
          uri: "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg",
          priority: FastImage.priority.high,
        }}
      />
      <View style={{ marginLeft: wp(10), flex: 1 }}>
        <Text style={styles.textStyle}>
          {message}
          <Text style={styles.nameTextStyle}>{` ${name}`}</Text>
        </Text>
        <Text style={styles.timeTextStyle}>{moment(time).fromNow()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  conatiner: {
    paddingHorizontal: wp(20),
    flexDirection: "row",
  },
  imgStyle: {
    height: wp(50),
    width: wp(50),
    borderRadius: wp(50 / 2),
  },
  textStyle: {
    ...commonFontStyle(fontFamily.regular, 16, colors.gery_6),
    flex: 1,
  },
  nameTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 16, colors.black),
  },
  timeTextStyle: {
    ...commonFontStyle(fontFamily.regular, 13, colors.grey_18),
    marginTop: hp(10),
  },
});

export default NotificationItem;
