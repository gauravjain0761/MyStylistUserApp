import {
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC, useState } from "react";
import { colors } from "../../theme/color";
import { images } from "../../theme/icons";
import {
  dispatchNavigation,
  errorToast,
  fontSize,
  hp,
  validPhonenumber,
  wp,
} from "../../helper/globalFunction";
import { strings } from "../../helper/string";
import Login_Input from "../../components/common/Login_Input";
import { commonFontStyle } from "../../theme/fonts";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { screenName } from "../../helper/routeNames";

const Login: FC = () => {
  const [numbers, setNumbers] = useState<string>("");

  const validate = () => {
    if (validPhonenumber(numbers)) {
      dispatchNavigation(screenName.OptVerification, numbers);
    } else {
      if (numbers.trim() == " ") {
        errorToast("Enter Valid Number");
      }
      errorToast("Enter Valid Number");
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid
        enableAutomaticScroll
        extraScrollHeight={360}
        keyboardShouldPersistTaps={"handled"}
        style={{ flex: 1 }}
      >
        <View style={styles.login_bg}>
          <Image
            source={images?.login_bg}
            style={styles?.login_bg_img}
            resizeMode="contain"
          />
          <Image
            source={images?.gradient_rectangle}
            style={styles?.gradient_rectangle}
            resizeMode="cover"
          />
        </View>
        <ImageBackground
          source={images?.gradient_model}
          style={styles?.gradient_modal}
          resizeMode="cover"
        >
          <View style={styles?.modal_container}>
            <Image
              source={images?.logo}
              style={styles?.logo}
              resizeMode="contain"
            />
            <View style={styles?.welcome_container}>
              <Text style={styles?.welcome_title}>{strings?.Welcome}</Text>
              <Text style={styles?.welcome_contain}>
                {strings?.Today_is_a_new_day}
              </Text>
            </View>
            <View style={styles?.input_container}>
              <Text style={styles?.mobile_title}>{strings?.Mobile_Number}</Text>
              <Login_Input
                placeholder="9 9 9 9 9 9 9 9 9"
                input_style={styles?.input_style}
                onTextChange={setNumbers}
              />
              <TouchableOpacity
                style={styles?.otp_btn}
                onPress={() => validate()}
              >
                <Text style={styles?.otp_btn_title}>{strings?.Get_OTP}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  login_bg: {
    justifyContent: "center",
    alignItems: "center",
  },
  login_bg_img: {
    marginTop: hp(10),
    width: "100%",
    height: hp(292),
  },
  gradient_rectangle: {
    height: hp(462),
    position: "absolute",
    zIndex: -10,
    top: 0,
    width: "100%",
  },
  gradient_modal: {
    width: "100%",
    height: hp(585),
    position: "absolute",
    top: hp(277),
    borderTopLeftRadius: wp(40),
    borderTopRightRadius: wp(40),
    overflow: "hidden",
  },
  logo: {
    width: wp(178),
    height: hp(58.43),
    alignSelf: "center",
    marginTop: hp(57),
  },
  welcome_title: {
    ...commonFontStyle("Inter-SemiBold", 40.33, colors.white),
  },
  welcome_container: {
    alignItems: "flex-start",
    marginTop: hp(72.57),
  },
  welcome_contain: {
    ...commonFontStyle("Inter-Regular", 14.33, colors.fc_light_gray),
    marginTop: hp(7),
  },
  input_container: {
    marginTop: hp(58),
    alignItems: "flex-start",
    // marginHorizontal: wp(51),
  },
  mobile_title: {
    color: colors?.fc_light_gray,
    fontSize: fontSize(16),
    marginBottom: hp(14),
  },
  otp_btn: {
    width: wp(280),
    height: hp(56),
    backgroundColor: colors?.primary_light_blue,
    borderRadius: wp(10),
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(27),
  },
  otp_btn_title: {
    fontSize: fontSize(20),
    color: colors?.black,
    ...commonFontStyle("Inter-Medium", 20, colors?.black),
  },
  modal_container: {
    justifyContent: "center",
    alignItems: "center",
  },
  input_style: {
    paddingLeft: wp(22),
    color: colors?.fc_light_gray,
  },
});
