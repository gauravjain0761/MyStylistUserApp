import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modal";
import { colors } from "../../theme/color";
import { hp, wp } from "../../helper/globalFunction";
import { strings } from "../../helper/string";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { images } from "../../theme/icons";

type props = {
  LocationAllow?: any;
  onPressDontAllow: () => void;
  onPressAllow: () => void;
  isVisible: boolean;
};

const LocationModal = ({
  onPressAllow,
  onPressDontAllow,
  LocationAllow,
  isVisible,
}: props) => {
  return (
    <Modal style={styles.modalContainer} isVisible={isVisible}>
      <View style={styles.innerContainer}>
        <Image
          resizeMode="cover"
          source={images.location}
          style={styles.imageStyle}
        />
        <Text style={styles.titleTextStyle}>
          {strings["Allow us to access your location"]}
        </Text>
        <Text style={styles.greyTextStyle}>
          {
            strings[
              "We need access to your location to show you relevant Stylists, Offers and Packages"
            ]
          }
        </Text>
        <View style={styles.rowStyle}>
          <TouchableOpacity onPress={onPressDontAllow}>
            <ImageBackground
              resizeMode="contain"
              style={styles.buttonStyle}
              source={images.gery_button}
            >
              <Text style={styles.buttonTextStyle}>
                {strings["Don’t Allow"]}
              </Text>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressAllow}>
            <ImageBackground
              resizeMode="contain"
              style={styles.buttonStyle}
              source={images.blue_button}
            >
              <Text style={styles.buttonTextStyle}>{strings["Allow"]}</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    margin: 0,
    justifyContent: "flex-end",
  },
  innerContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.white,
    padding: wp(20),
  },
  imageStyle: {
    height: wp(150),
    width: wp(150),
    borderRadius: wp(150 / 2),
    backgroundColor: colors.gray_border,
    alignSelf: "center",
    marginVertical: hp(10),
  },
  titleTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 23, colors.black),
    textAlign: "center",
    marginTop: hp(10),
  },
  greyTextStyle: {
    ...commonFontStyle(fontFamily.medium, 14, colors.gery_1),
    textAlign: "center",
    marginVertical: hp(5),
    lineHeight: 20,
  },
  rowStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: hp(10),
    marginTop: hp(25),
  },
  buttonStyle: {
    height: hp(60),
    width: wp(165),
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black_2),
  },
});

export default LocationModal;
