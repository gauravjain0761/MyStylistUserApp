import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import ReactNativeModal from "react-native-modal";
import { colors } from "../../theme/color";
import { hp, wp } from "../../helper/globalFunction";
import { CongratulationIcon } from "../../theme/SvgIcon";
import { strings } from "../../helper/string";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { images } from "../../theme/icons";

type props = {
  isVisible: boolean;
  onPressHome: () => void;
};

const CongratulationModal = ({ isVisible, onPressHome }: props) => {
  return (
    <ReactNativeModal isVisible={isVisible}>
      <View style={styles.container}>
        <CongratulationIcon />
        <Text style={styles.titleTextStyle}>{strings["Congratulation"]}</Text>
        <Text style={styles.greyTextStyle}>
          {strings["You can view your booking in the appointment section."]}
        </Text>
        <Text style={styles.greyboldTextStyle}>
          {strings["Please pay in person to the Stylist."]}
        </Text>
        <TouchableOpacity onPress={onPressHome}>
          <ImageBackground
            resizeMode="contain"
            style={styles.bookImgStyle}
            source={images.book_home}
          >
            <Text style={styles.bookTextStyle}>{strings["Back to Home"]}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </ReactNativeModal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: wp(20),
    borderRadius: 20,
    alignItems: "center",
  },
  titleTextStyle: {
    ...commonFontStyle(fontFamily.bold, 30, colors.black),
    marginVertical: hp(10),
  },
  greyTextStyle: {
    ...commonFontStyle(fontFamily.regular, 17, colors.gery_6),
    textAlign: "center",
  },
  greyboldTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 16, colors.gery_6),
    textAlign: "center",
    marginVertical: hp(10),
  },
  bookImgStyle: {
    justifyContent: "center",
    alignItems: "center",
    height: hp(53),
    width: wp(210),
    marginTop: hp(20),
    marginBottom: hp(10),
  },
  bookTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 17, colors.black),
  },
});

export default CongratulationModal;
