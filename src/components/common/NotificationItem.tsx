import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { hp, wp } from "../../helper/globalFunction";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";

const NotificationItem = () => {
  return (
    <View style={styles.conatiner}>
      <Image
        resizeMode="cover"
        style={styles.imgStyle}
        source={{
          uri: "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg",
        }}
      />
      <View style={{ marginLeft: wp(10), flex: 1 }}>
        <Text style={styles.textStyle}>
          {"Your appointment has been successfully schedule with "}
          <Text style={styles.nameTextStyle}>{"Nickson John"}</Text>
        </Text>
        <Text style={styles.timeTextStyle}>{"1 hr ago"}</Text>
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
