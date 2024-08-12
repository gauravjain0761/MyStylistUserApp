import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { hp, wp } from "../../helper/globalFunction";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";
import FastImage from "react-native-fast-image";
import { api } from "../../helper/apiConstants";
import moment from "moment";
import { useAppSelector } from "../../redux/hooks";

const SenderItem = ({ data }: any) => {
  const { profileData } = useAppSelector((state) => state?.profile);
  const image =
    profileData?.user?.user_profile_images?.filter(
      (images) => images?.is_featured == 1
    )?.[0]?.image || [];
  return (
    <View style={styles.conatiner}>
      <View style={styles.rowStyle}>
        <Text style={styles.timeTextStyle}>
          {moment(data?.time).format("HH:mm A")}
        </Text>
        {data?.image ? (
          <FastImage
            style={styles.imgStyle}
            source={{
              uri: api.IMG_URL + data?.image,
              priority: FastImage.priority.high,
            }}
          />
        ) : (
          <FastImage
            style={styles.imgStyle}
            source={{
              uri: api.IMG_URL + image,
              priority: FastImage.priority.high,
            }}
          />
        )}
      </View>
      <View style={styles.msgViewStyle}>
        <View style={styles.tirangle} />
        <Text style={styles.textStyle}>{data?.content}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  conatiner: {
    marginTop: hp(10),
    maxWidth: "85%",
    alignSelf: "flex-end",
  },
  rowStyle: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  imgStyle: {
    height: wp(32),
    width: wp(32),
    borderRadius: wp(32 / 2),
    marginRight: wp(10),
  },
  timeTextStyle: {
    ...commonFontStyle(fontFamily.regular, 12, colors.dashed_boredr),
    marginHorizontal: wp(5),
  },
  msgViewStyle: {
    padding: wp(15),
    backgroundColor: colors.primary_light_blue,
    borderRadius: 10,
    alignSelf: "flex-end",
    marginVertical: hp(20),
  },
  textStyle: {
    ...commonFontStyle(fontFamily.regular, 16, colors.black),
  },
  tirangle: {
    top: hp(-10),
    right: wp(15),
    width: wp(19),
    height: hp(16),
    borderStyle: "solid",
    position: "absolute",
    borderLeftWidth: wp(12),
    borderRightWidth: wp(12),
    borderBottomWidth: wp(10 * 2),
    borderLeftColor: "transparent",
    backgroundColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: colors.primary_light_blue,
  },
});

export default SenderItem;
