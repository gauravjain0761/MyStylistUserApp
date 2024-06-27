import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../../theme/color";
import { icons, images } from "../../theme/icons";
import { hp, wp } from "../../helper/globalFunction";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  DirectionIcon,
  FillBell,
  FillCart,
  FillLike,
  Hamburger,
  RightArrow,
} from "../../theme/SvgIcon";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "../../helper/routeNames";
import { strings } from "../../helper/string";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppSelector } from "../../redux/hooks";

type HomeProps = {
  onPresslocation?: () => void;
  onPressCart?: () => void;
  onPressProfile?: () => void;
  onPressLike?: () => void;
  location?: any;
  edges?: any;
  containerStyle?: ViewStyle;
};

const HomeHeader = ({
  onPresslocation,
  onPressCart,
  onPressProfile,
  location,
  onPressLike,
  edges,
  containerStyle,
}: HomeProps) => {
  const { navigate } = useNavigation();
  const { profileData } = useAppSelector((state) => state.profile);
  const { cartCount } = useAppSelector((state) => state.cart);

  const onPressBell = () => {
    // @ts-ignore
    navigate(screenName.Notifications);
  };

  return (
    <SafeAreaView
      edges={edges || ["top"]}
      style={{ ...styles.container, ...containerStyle }}
    >
      <View style={styles?.drawer_btn}>
        <TouchableOpacity onPress={onPressProfile} style={styles.profile}>
          <Text style={styles.profile_text}>
            {profileData?.user?.name?.[0]}
          </Text>
        </TouchableOpacity>
        <View style={styles.rowStyle}>
          <Image
            resizeMode="contain"
            source={icons.location}
            style={styles.locationIconStyle}
          />
          <View style={styles.address_container}>
            <TouchableOpacity onPress={onPresslocation} style={styles.location}>
              <Text style={styles.home_title}>Home</Text>
              <View style={styles.location_icon}>
                <RightArrow />
              </View>
            </TouchableOpacity>
            {location?.length > 0 ? (
              <Text numberOfLines={1} style={styles.addrs}>
                {location}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
      <View style={styles?.header_service_container}>
        <TouchableOpacity onPress={onPressLike}>
          <FillLike />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressCart}>
          <FillCart />
          {cartCount > 0 ? (
            <View style={styles.countContainer}>
              <Text style={styles.countTextStyle}>{cartCount}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressBell}>
          <FillBell />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors?.white,
    paddingVertical: hp(10),
    paddingHorizontal: wp(20),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 1,
  },
  hemburger_icon: {
    width: wp(28),
    height: wp(28),
    alignSelf: "flex-start",
  },
  drawer_btn: {
    flexDirection: "row",
    gap: wp(6),
    alignItems: "center",
    flex: 1,
  },
  header_logo: {
    width: wp(100),
    height: hp(35),
    marginLeft: wp(50),
  },
  header_service_container: {
    flexDirection: "row",
    gap: wp(10),
    alignSelf: "center",
  },
  icons: {
    width: wp(24),
    height: wp(24),
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(5),
  },
  location_icon: {
    transform: [{ rotate: "90deg" }],
  },
  home_title: {
    ...commonFontStyle(fontFamily.medium, 18, colors.black),
  },
  addrs: {
    ...commonFontStyle(fontFamily.medium, 12, colors.gery_8),
    maxWidth: wp(200),
    textAlign: "left",
  },
  address_container: {
    flex: 1,
  },
  profile: {
    width: wp(26),
    height: wp(26),
    borderRadius: wp(50),
    backgroundColor: colors.green_4,
    justifyContent: "center",
    alignItems: "center",
  },
  profile_text: {
    ...commonFontStyle(fontFamily.medium, 16, colors.black),
  },
  rowStyle: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: wp(5),
    flex: 1,
  },
  locationIconStyle: {
    height: wp(25),
    width: wp(25),
    marginRight: wp(5),
  },
  countContainer: {
    height: wp(18),
    paddingHorizontal: wp(5),
    position: "absolute",
    backgroundColor: colors.primary_light_blue,
    borderRadius: 20,
    right: -wp(8),
    top: -wp(8),
    justifyContent: "center",
    alignItems: "center",
  },
  countTextStyle: {
    ...commonFontStyle(fontFamily.medium, 12, colors.black),
  },
});
