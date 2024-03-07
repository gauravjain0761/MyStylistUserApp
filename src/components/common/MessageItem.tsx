import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { hp, wp } from "../../helper/globalFunction";
import { MarkReadIcon } from "../../theme/SvgIcon";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";

type props = {
  index: number;
  onPressItem?: () => void;
};

const MessageItem = ({ index, onPressItem }: props) => {
  return (
    <TouchableOpacity onPress={onPressItem} style={styles.container}>
      <Image
        source={{
          uri: "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg",
        }}
        style={styles.imageStyle}
      />
      <View style={{ marginLeft: wp(10), flex: 1 }}>
        <View style={styles.rowStyle}>
          <Text style={styles.nameTextStyle}>{"Majid Khan"}</Text>
          <Text style={styles.timeTextStyle}> {"04:43"}</Text>
        </View>
        <View style={{ flex: 1 }} />
        <View style={styles.rowStyle}>
          <Text style={styles.greyTxtStyle}>
            {"Hello, welcome to our store. How can... "}
          </Text>
          {index === 1 ? (
            <View style={styles.circleStyle}>
              <Text style={styles.countTextStyle}>{"5"}</Text>
            </View>
          ) : (
            <MarkReadIcon color="#2BE8D9" />
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
  },
  rowStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nameTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 16, colors.black),
    marginTop: hp(5),
  },
  timeTextStyle: {
    ...commonFontStyle(fontFamily.regular, 12, colors.grey_18),
  },
  greyTxtStyle: {
    ...commonFontStyle(fontFamily.regular, 14, colors.gery_6),
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
