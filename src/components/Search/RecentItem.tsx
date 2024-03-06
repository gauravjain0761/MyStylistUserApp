import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { hitSlop, hp, wp } from "../../helper/globalFunction";
import { images } from "../../theme/icons";
import { VerifyIcon } from "../../theme/SvgIcon";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "../../helper/routeNames";
type props = {
  data: any;
  isHideClose?: boolean;
};

const RecentItem = ({ data, isHideClose }: props) => {
  const { navigate } = useNavigation();
  const onPressItem = () => {
    // @ts-ignore
    navigate(screenName.YourStylist);
  };
  return (
    <TouchableOpacity onPress={onPressItem} style={styles.container}>
      <Image source={images.barber} style={styles.imgStyle} />
      <View style={{ marginLeft: wp(10), flex: 1 }}>
        <View style={styles.rowStyle}>
          <Text style={styles.nameTextStyle}>{"Majid Khan"}</Text>
          <VerifyIcon height={12} width={12} />
        </View>
        <View style={{ height: hp(6) }} />
        <Text style={styles.addressTextStyle}>{"Sector 67, Mohali"}</Text>
      </View>
      {isHideClose ? null : (
        <TouchableOpacity hitSlop={hitSlop}>
          <Text style={styles.addressTextStyle}>{"X"}</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: wp(20),
    marginTop: hp(20),
    alignItems: "center",
  },
  imgStyle: {
    height: wp(56),
    width: wp(56),
    borderRadius: 8,
  },
  rowStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black),
    marginRight: wp(5),
  },
  addressTextStyle: {
    ...commonFontStyle(fontFamily.regular, 14, colors.gery_9),
  },
});

export default RecentItem;
