import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { hp, wp } from "../../helper/globalFunction";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";

const ReciverItem = () => {
  return (
    <View style={styles.conatiner}>
      <View style={styles.rowStyle}>
        <Image
          style={styles.imgStyle}
          source={{
            uri: "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg",
          }}
        />
        <Text style={styles.timeTextStyle}>{"11:00 PM"}</Text>
      </View>
      <View style={styles.msgViewStyle}>
        <View style={styles.tirangle}></View>
        <Text style={styles.textStyle}>
          {"Hello, welcome to our store. How can I help you today?"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  conatiner: {
    marginTop: hp(10),
    maxWidth: "85%",
    alignSelf: "flex-start",
  },
  rowStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  imgStyle: {
    height: wp(32),
    width: wp(32),
    borderRadius: wp(32 / 2),
    marginLeft: wp(10),
  },
  timeTextStyle: {
    ...commonFontStyle(fontFamily.regular, 12, colors.dashed_boredr),
    marginHorizontal: wp(5),
  },
  msgViewStyle: {
    padding: wp(15),
    backgroundColor: colors.grey_19,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginVertical: hp(20),
  },
  textStyle: {
    ...commonFontStyle(fontFamily.regular, 16, colors.black),
  },
  tirangle: {
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
    borderBottomColor: colors.grey_19,
    top: hp(-10),
    left: wp(15),
  },
});

export default ReciverItem;
