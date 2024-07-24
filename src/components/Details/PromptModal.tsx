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
import { CloseIcon, CongratulationIcon } from "../../theme/SvgIcon";
import { strings } from "../../helper/string";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { images } from "../../theme/icons";

type props = {
  isVisible: boolean;
  onPressYes: () => void;
  onPressCancel?: () => void;
};

const PromptModal = ({ isVisible, onPressCancel, onPressYes }: props) => {
  return (
    <ReactNativeModal isVisible={isVisible}>
      <View style={styles.container}>
        <Text style={styles.greyTextStyle}>
          {
            "You have already added a Service from a different Stylist in the Cart, adding this Service will empty your Cart ."
          }
        </Text>
        <View style={styles.btn_container}>
          <TouchableOpacity style={styles?.btnStyle} onPress={onPressCancel}>
            <ImageBackground
              source={images.grey_border_button}
              style={styles.btn_style}
              resizeMode="stretch"
            >
              <Text style={styles.btn_tite}>{strings.Cancel}</Text>
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity style={styles?.btnStyle} onPress={onPressYes}>
            <ImageBackground
              source={images?.blue_button}
              style={styles.btn_style}
              resizeMode="stretch"
            >
              <Text style={styles.btn_tite}>{strings.Apply}</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </View>
    </ReactNativeModal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: wp(20),
    borderRadius: 20,
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
  btn_tite: {
    ...commonFontStyle(fontFamily.medium, 18, colors.black),
    paddingVertical: hp(10),
  },
  btn_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: hp(30),
    gap: wp(20),
  },
  btn_style: {
    justifyContent: "center",
    alignItems: "center",
  },
  btnStyle: {
    flex: 1,
  },
});

export default PromptModal;
