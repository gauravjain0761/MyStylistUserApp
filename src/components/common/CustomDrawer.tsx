import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { icons, images } from "../../theme/icons";
import { dispatchNavigation, hp, wp } from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { strings } from "../../helper/string";
import {
  Appointment,
  Drawer_Notification,
  FAQ,
  Favorites,
  Logout,
  PrivacyPolicy,
  RightArrow,
  Termsandconditions,
} from "../../theme/SvgIcon";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "../../helper/routeNames";
import { useAppSelector } from "../../redux/hooks";

const CustomDrawer = () => {
  const { navigate } = useNavigation();
  const { profileData } = useAppSelector((state) => state.profile);

  const onPressName = () => {
    navigate(screenName.Profile);
  };
  const OnPressFaq = () => {
    return navigate(screenName.FaQ);
  };

  const onPressLogOut = () => {
    return dispatchNavigation(screenName.Login);
  };

  const onPressFavorite = () => {
    navigate(screenName.MyFavorites);
  };

  const onPressPrivacy = () => {
    navigate(screenName.PrivacyPolicy);
  };

  const onPressTerms = () => {
    navigate(screenName.TermsCondition);
  };

  const onPressMyAppointment = () => {
    navigate(screenName.tab_bar_name.Appointment);
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <View>
        <TouchableOpacity onPress={onPressName} style={styles.image_container}>
          <View style={styles.img_conatiner}>
            <Image
              resizeMode="cover"
              source={{
                uri:
                  profileData?.user_profile_images_url +
                  profileData.user.user_profile_images?.[0]?.image,
              }}
              style={styles.img}
            />
          </View>
          <View>
            <Text style={styles.user_title}>{profileData?.user.name}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.account_container}>
          <Text style={styles.account_title}>{strings.Account_Setting}</Text>
          <View style={styles.drawerTab_conatiner}>
            <View style={styles.drawer_border}>
              <TouchableOpacity
                onPress={onPressFavorite}
                style={styles.Tab_container}
              >
                <View style={styles.tab_img_constiner}>
                  <Image
                    source={icons.favorites}
                    resizeMode="contain"
                    style={styles.tab_img}
                  />
                  <Text style={styles.tab_title}>{strings.My_Favorites}</Text>
                </View>
                <RightArrow />
              </TouchableOpacity>
            </View>

            <View style={styles.drawer_border}>
              <TouchableOpacity
                onPress={onPressMyAppointment}
                style={styles.Tab_container}
              >
                <View style={styles.tab_img_constiner}>
                  <Image
                    source={icons.appointment}
                    resizeMode="contain"
                    style={styles.tab_img}
                  />
                  <Text style={styles.tab_title}>
                    {strings.My_Appointments}
                  </Text>
                </View>
                <RightArrow />
              </TouchableOpacity>
            </View>

            <View style={styles.drawer_border}>
              <TouchableOpacity style={styles.Tab_container}>
                <View style={styles.tab_img_constiner}>
                  <Image
                    source={icons.notifications}
                    resizeMode="contain"
                    style={styles.tab_img}
                  />
                  <Text style={styles.tab_title}>
                    {strings.Notification_Settings}
                  </Text>
                </View>
                <RightArrow />
              </TouchableOpacity>
            </View>

            <View style={styles.drawer_border}>
              <TouchableOpacity
                onPress={() => OnPressFaq()}
                style={styles.Tab_container}
              >
                <View style={styles.tab_img_constiner}>
                  <Image
                    source={icons.faq}
                    resizeMode="contain"
                    style={styles.tab_img}
                  />
                  <Text style={styles.tab_title}>{strings.FAQ_s}</Text>
                </View>
                <RightArrow />
              </TouchableOpacity>
            </View>

            <View style={styles.drawer_border}>
              <TouchableOpacity
                onPress={onPressPrivacy}
                style={styles.Tab_container}
              >
                <View style={styles.tab_img_constiner}>
                  <Image
                    source={icons.privacypolicy}
                    resizeMode="contain"
                    style={styles.tab_img}
                  />
                  <Text style={styles.tab_title}>{strings.Privacy_Policy}</Text>
                </View>
                <RightArrow />
              </TouchableOpacity>
            </View>

            <View style={styles.drawer_border}>
              <TouchableOpacity
                onPress={onPressTerms}
                style={styles.Tab_container}
              >
                <View style={styles.tab_img_constiner}>
                  <Image
                    source={icons.terms}
                    resizeMode="contain"
                    style={styles.tab_img}
                  />
                  <Text style={styles.tab_title}>
                    {strings.TermsConditions}
                  </Text>
                </View>
                <RightArrow />
              </TouchableOpacity>
            </View>
            <View style={[styles.drawer_border, { borderBottomWidth: 0 }]}>
              <TouchableOpacity
                onPress={onPressLogOut}
                style={[styles.Tab_container]}
              >
                <View style={styles.tab_img_constiner}>
                  <Image
                    source={icons.logout}
                    resizeMode="contain"
                    style={styles.tab_img}
                  />
                  <Text style={styles.tab_title}>{strings.Logout}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.connect_btn}>
        <Image source={images.contectus} style={styles.connect_us} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "space-between",
  },
  image_container: {
    paddingLeft: wp(20),
    paddingBottom: hp(20),
    borderBottomWidth: hp(1),
    borderColor: colors.review_caed_border,
    marginTop: hp(30),
  },
  img: {
    width: wp(74),
    height: wp(74),
    borderRadius: 10,
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
    // marginTop: hp(20),
    paddingVertical: hp(20),
  },
  tab_img_constiner: {
    flexDirection: "row",
    gap: wp(15),
    alignItems: "center",
  },
  tab_title: {
    ...commonFontStyle(fontFamily.medium, 14, colors.black),
  },
  drawer_border: {
    borderBottomWidth: 1,
    borderColor: colors.review_caed_border,
  },
  connect_us: {
    width: wp(127),
    height: hp(48),
    alignSelf: "flex-start",
    justifyContent: "flex-start",
  },
  connect_btn: {
    alignSelf: "flex-start",
    marginBottom: hp(30),
    paddingLeft: wp(20),
  },
  tab_img: {
    width: wp(20),
    height: wp(20),
  },
});
