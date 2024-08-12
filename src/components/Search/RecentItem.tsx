import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { hitSlop, hp, wp } from "../../helper/globalFunction";
import { images } from "../../theme/icons";
import { VerifyIcon } from "../../theme/SvgIcon";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "../../helper/routeNames";
import FastImage from "react-native-fast-image";
type props = {
  data: any;
  isHideClose?: boolean;
  featured_image_url?: string;
  onPressItem: () => void;
  onPressClose?: () => void;
};

const RecentItem = ({
  data,
  isHideClose,
  featured_image_url,
  onPressItem,
  onPressClose,
}: props) => {
  const { navigate } = useNavigation();
  // const onPressItem = () => {
  //   // @ts-ignore
  //   navigate(screenName.YourStylist, { id: data?._id });
  // };
  return (
    <TouchableOpacity onPress={onPressItem} style={styles.container}>
      <FastImage
        source={{
          uri:
            featured_image_url +
            "/" +
            data?.user_profile_images?.filter(
              (images) => images?.is_featured == 1
            )?.[0]?.image,
          priority: FastImage.priority.high,
        }}
        style={styles.imgStyle}
      />
      <View style={{ marginLeft: wp(10), flex: 1 }}>
        <View style={styles.rowStyle}>
          <Text style={styles.nameTextStyle}>{data?.name}</Text>
          <VerifyIcon height={12} width={12} />
        </View>
        <View style={{ height: hp(6) }} />
        <Text numberOfLines={1} style={styles.addressTextStyle}>
          {data?.addresses?.[0]?.address?.houseNumber}{" "}
          {data?.addresses?.[0]?.address?.sector}{" "}
          {data?.addresses?.[0]?.address?.pinCode}{" "}
          {data?.addresses?.[0]?.address?.landmark}
        </Text>
      </View>
      {isHideClose ? null : (
        <TouchableOpacity onPress={onPressClose} hitSlop={hitSlop}>
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
    backgroundColor: colors.grey_19,
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
