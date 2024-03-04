import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { images } from "../../theme/icons";
import { hp, wp } from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { strings } from "../../helper/string";
import { Appointment, Favorites, RightArrow } from "../../theme/SvgIcon";

const CustomDrawer = () => {
  return (
    <View style={styles.container}>
      <View style={styles.image_container}>
        <View style={styles.img_conatiner}>
          <Image
            resizeMode="contain"
            source={images.drawerImg}
            style={styles.img}
          />
        </View>
        <Text style={styles.user_title}>{strings.Nickson_John}</Text>
      </View>
      <View style={styles.account_container}>
        <Text style={styles.account_title}>{strings.Account_Setting}</Text>
        <View style={styles.drawerTab_conatiner}>
          <View style={styles.Tab_container}>
            <View style={styles.tab_img_constiner}>
              <Favorites />
              <Text style={styles.tab_title}>{strings.My_Favorites}</Text>
            </View>
            <RightArrow />
          </View>

          <View style={styles.Tab_container}>
            <View style={styles.tab_img_constiner}>
              <Appointment />
              <Text style={styles.tab_title}>{strings.My_Appointments}</Text>
            </View>
            <RightArrow />
          </View>

          <View style={styles.Tab_container}>
            <View style={styles.tab_img_constiner}>
              <Favorites />
              <Text style={styles.tab_title}>
                {strings.Notification_Settings}
              </Text>
            </View>
            <RightArrow />
          </View>

          <View style={styles.Tab_container}>
            <View style={styles.tab_img_constiner}>
              <Favorites />
              <Text style={styles.tab_title}>{strings.FAQ_s}</Text>
            </View>
            <RightArrow />
          </View>

          <View style={styles.Tab_container}>
            <View style={styles.tab_img_constiner}>
              <Favorites />
              <Text style={styles.tab_title}>{strings.Privacy_Policy}</Text>
            </View>
            <RightArrow />
          </View>

          <View style={styles.Tab_container}>
            <View style={styles.tab_img_constiner}>
              <Favorites />
              <Text style={styles.tab_title}>{strings.TermsConditions}</Text>
            </View>
            <RightArrow />
          </View>

          <View style={styles.Tab_container}>
            <View style={styles.tab_img_constiner}>
              <Favorites />
              <Text style={styles.tab_title}>{strings.Logout}</Text>
            </View>
            <RightArrow />
          </View>
        </View>
      </View>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  container: {},
  image_container: {
    paddingLeft: wp(20),
    paddingBottom: hp(20),
    borderBottomWidth: hp(1),
    borderColor: colors.review_caed_border,
  },
  img: {
    width: wp(74),
    height: wp(74),
  },
  img_conatiner: {
    borderWidth: 2,
    borderColor: colors.primary_light_blue,
    width: wp(83),
    height: wp(82),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp(12),
    overflow: "hidden",
  },
  user_title: {
    ...commonFontStyle(fontFamily.bold, 16, colors.black),
    marginTop: hp(10),
  },
  account_container: {
    marginHorizontal: wp(20),
    marginTop: hp(16),
  },
  account_title: {
    ...commonFontStyle(fontFamily.bold, 16, colors.black),
  },
  drawerTab_conatiner: {},
  Tab_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: hp(20),
    marginTop: hp(20),
  },
  tab_img_constiner: {
    flexDirection: "row",
    gap: wp(15),
    alignItems: "center",
  },
  tab_title: {
    ...commonFontStyle(fontFamily.medium, 14, colors.black),
  },
});
