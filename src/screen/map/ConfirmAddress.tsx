import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  TextInput,
} from "react-native";
import { colors } from "../../theme/color";
import { BackHeader } from "../../components";
import { strings } from "../../helper/string";
import MapView from "react-native-maps";
import { icons, images } from "../../theme/icons";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { hp, wp } from "../../helper/globalFunction";
import { SearchIcon2 } from "../../theme/SvgIcon";

const ConfirmAddress = () => {
  const onPressEdit = () => {};
  return (
    <View style={styles.container}>
      <BackHeader title={strings["Confirm your address"]} />

      <View style={styles.mapViewContainer}>
        <MapView style={styles.mapContainer} />
        <View style={styles?.search_box}>
          <SearchIcon2 />
          <View style={styles?.input}>
            <TextInput
              style={styles.searchTextStyle}
              placeholderTextColor={colors.grey_17}
              placeholder={strings["Search for area, street name..."]}
            />
          </View>
        </View>
      </View>

      <View style={styles.bottomStyle}>
        <View>
          <View style={styles.rowBottomStyle}>
            <Image
              resizeMode="contain"
              source={icons.marker_red}
              style={styles.markerStyle}
            />
            <Text style={styles.boldTextStyle}>{"Ansal Palm Grove"}</Text>
          </View>
          <Text style={styles.addressTextStyle}>
            {"Sector-115, Sahibzada Ajit Singh Nagar"}
          </Text>
        </View>
        <TouchableOpacity onPress={onPressEdit}>
          <ImageBackground
            resizeMode="contain"
            style={styles.bookImgStyle}
            source={images.book_button}
          >
            <Text style={styles.bookTextStyle}>
              {strings["Edit complete address"]}
            </Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background_grey,
  },
  mapContainer: {
    flex: 1,
  },
  bottomStyle: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    backgroundColor: colors.white,
    padding: wp(20),
    paddingBottom: hp(25),
    justifyContent: "center",
  },
  bookImgStyle: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(10),
  },
  bookTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black),
    paddingVertical: hp(20),
    paddingHorizontal: wp(60),
  },
  rowBottomStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  markerStyle: {
    height: wp(22),
    width: wp(22),
  },
  boldTextStyle: {
    ...commonFontStyle(fontFamily.regular, 17, "#313131"),
    marginHorizontal: wp(5),
  },
  addressTextStyle: {
    ...commonFontStyle(fontFamily.regular, 15, "#7C7C7C"),
    marginLeft: wp(25),
    marginTop: hp(5),
    marginBottom: hp(15),
  },
  search_icon: {
    width: wp(24),
    height: wp(24),
    marginLeft: wp(16),
  },
  input: {
    marginLeft: wp(5),
  },
  search_box: {
    backgroundColor: colors?.white,
    borderWidth: 1,
    height: hp(41),
    borderColor: colors?.gray_border,
    borderRadius: wp(8),
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: wp(10),
    marginHorizontal: wp(20),
    marginVertical: hp(15),
    position: "absolute",
    width: "90%",
    alignSelf: "center",
  },
  searchTextStyle: {
    ...commonFontStyle(fontFamily.regular, 12, "#949495"),
  },
  mapViewContainer: {
    flex: 1,
  },
});

export default ConfirmAddress;
