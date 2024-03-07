import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { hp, wp } from "../../helper/globalFunction";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";

const SenderItem = () => {
  return (
    <View style={styles.conatiner}>
      <View style={styles.rowStyle}>
        <Text style={styles.timeTextStyle}>{"11:00 PM"}</Text>
        <Image
          style={styles.imgStyle}
          source={{
            uri: "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg",
          }}
        />
      </View>
      <View style={styles.msgViewStyle}>
        <View style={styles.tirangle} />
        <Text style={styles.textStyle}>
          {"I'm looking for a new hairstyle."}
        </Text>
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
    alignSelf: "flex-start",
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
