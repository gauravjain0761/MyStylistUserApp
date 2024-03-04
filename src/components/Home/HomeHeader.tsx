import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors } from "../../theme/color";
import { icons, images } from "../../theme/icons";
import { hp, wp } from "../../helper/globalFunction";
import { SafeAreaView } from "react-native-safe-area-context";
import { FillBell, FillCart, FillLike, Hamburger } from "../../theme/SvgIcon";

type HomeProps = {
  onPressBack?: () => void;
};

const HomeHeader = ({ onPressBack }: HomeProps) => {
  return (
    <SafeAreaView edges={["top"]} style={styles?.container}>
      <TouchableOpacity onPress={onPressBack} style={styles?.drawer_btn}>
        <Hamburger />
      </TouchableOpacity>
      <Image source={images?.header_logo} style={styles?.header_logo} />
      <View style={styles?.header_service_container}>
        <TouchableOpacity>
          <FillLike />
        </TouchableOpacity>
        <TouchableOpacity>
          <FillCart />
        </TouchableOpacity>
        <TouchableOpacity>
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
    paddingVertical: hp(17),
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
  drawer_btn: {},
  header_logo: {
    width: wp(85),
    height: hp(27),
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
});
