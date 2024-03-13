import {
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { colors } from "../../theme/color";
import { icons, images } from "../../theme/icons";
import {
  dispatchNavigation,
  fontSize,
  hp,
  infoToast,
  otpToast,
  successToast,
  wp,
} from "../../helper/globalFunction";
import { strings } from "../../helper/string";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import Login_Input from "../../components/common/Login_Input";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { useRoute } from "@react-navigation/native";
import { screenName } from "../../helper/routeNames";
import { verifyOTP } from "../../actions/authAction";
import { useAppDispatch } from "../../redux/hooks";

const CELL_COUNT = 6;

const OtpVerification = ({ route }: any) => {
  const [value, setValue] = useState<string>("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const data = route?.params;
  const dispatch = useAppDispatch();

  const onPressSubmit = () => {
    if (value.length === 0) {
      infoToast("Please enter your OTP");
    } else {
      const obj = {
        data: {
          phone: data.phone,
          otp: value,
        },
        onSuccess: (res: any) => {
          successToast("OTP verification successful");
          dispatchNavigation(screenName?.Home);
        },
        onFailure: () => {},
      };
      dispatch(verifyOTP(obj));
    }
  };

  return (
    <View style={styles?.container}>
      <StatusBar translucent backgroundColor={"transparent"} />
      <ImageBackground
        source={images?.gradient_bg}
        style={styles?.bg_container}
      >
        <TouchableOpacity
          style={styles?.back_arrow}
          onPress={() => dispatchNavigation(screenName.Login)}
        >
          <Image
            source={icons.left_arrow}
            style={styles.arrow_img}
            resizeMode="cover"
          />
        </TouchableOpacity>

        <View style={styles.otp_title_conatiner}>
          <Text style={styles.otp_title}>{strings?.Verify_OTP}</Text>
          <Text style={styles.otp_info}>{strings?.Enter_the_6_digit}</Text>
          <Text style={styles.otp_info}>{data.phone}</Text>
        </View>

        <View style={styles?.input_container}>
          <Text style={styles.otp_label}>{strings?.OTP}</Text>
          <Login_Input
            input_container_style={styles.input_con_style}
            placeholder=""
            custom_component={
              <CodeField
                ref={ref}
                {...props}
                value={value}
                onChangeText={setValue}
                cellCount={CELL_COUNT}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({ index, symbol, isFocused }) => (
                  <Text
                    key={index}
                    style={[styles.cell]}
                    onLayout={getCellOnLayoutHandler(index)}
                  >
                    {symbol || (isFocused ? <Cursor /> : "-")}
                  </Text>
                )}
              />
            }
          />
        </View>

        <View style={styles?.resend_otp_conatiner}>
          <Text style={styles?.didnt_otp_title}>
            {strings?.Didnt_receive_OTP}
          </Text>
          <TouchableOpacity>
            <Text style={styles?.resend_otp_title}>{strings?.Resend_OTP}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles?.otp_btn}
          onPress={() => onPressSubmit()}
        >
          <Text style={styles?.otp_btn_title}>{strings.Login}</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default OtpVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors?.white,
  },
  bg_container: {
    flex: 1,
  },
  back_arrow: {
    marginTop: hp(61),
    marginLeft: wp(26),
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  otp_title: {
    ...commonFontStyle(fontFamily.semi_bold, 40.33, colors?.white),
  },
  otp_info: {
    ...commonFontStyle(fontFamily.medium, 14.33, colors?.fc_light_gray),
    lineHeight: hp(24),
    marginTop: hp(6),
  },
  otp_title_conatiner: {
    paddingLeft: wp(51),
    marginTop: hp(28),
  },
  arrow_img: {
    width: wp(28),
    height: wp(28),
  },
  otp_label: {
    ...commonFontStyle(fontFamily.medium, 16, colors?.fc_light_gray_2),
  },
  input_container: {
    paddingLeft: wp(51),
    marginTop: hp(58),
  },
  input_con_style: {
    marginTop: wp(14),
    justifyContent: "center",
    alignItems: "center",
  },
  resend_otp_conatiner: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(91),
  },
  didnt_otp_title: {
    ...commonFontStyle(fontFamily.medium, 16, "rgba(rgba(164, 164, 164, 0.6))"),
    marginBottom: hp(15),
  },
  resend_otp_title: {
    ...commonFontStyle(fontFamily.semi_bold, 16, colors?.white),
    textDecorationLine: "underline",
  },

  root: { flex: 1, padding: 20 },
  title: { textAlign: "center", fontSize: 30, color: colors?.fc_light_gray },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    // borderWidth: 2,
    // borderColor: '#00000030',
    textAlign: "center",
    color: colors?.fc_light_gray,
  },
  otp_btn: {
    width: wp(280),
    height: hp(56),
    backgroundColor: colors?.primary_light_blue,
    borderRadius: wp(10),
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(30),
    alignSelf: "center",
  },
  otp_btn_title: {
    color: colors?.black,
    ...commonFontStyle(fontFamily.medium, 20, colors?.black),
  },
});
