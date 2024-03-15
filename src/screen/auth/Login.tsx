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
import React, { FC, useEffect, useState } from "react";
import { colors } from "../../theme/color";
import { images } from "../../theme/icons";
import {
  dispatchNavigation,
  errorToast,
  fontSize,
  hp,
  infoToast,
  isIos,
  validPhonenumber,
  wp,
} from "../../helper/globalFunction";
import { strings } from "../../helper/string";
import Login_Input from "../../components/common/Login_Input";
import { commonFontStyle } from "../../theme/fonts";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { screenName } from "../../helper/routeNames";
import { useAppDispatch } from "../../redux/hooks";
import {
  NavigationProp,
  NavigationState,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { sendVerifyCode } from "../../actions/authAction";
import {
  getAddress,
  requestLocationPermission,
} from "../../helper/locationHandler";

const Login: FC = () => {
  const [phoneNum, setphoneNum] = useState<string>("");
  const [location, setlocation] = useState<any>({});
  const [ispermission, setpermission] = useState(false);
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();

  useEffect(() => {
    locationHandler();
  }, []);

  const locationHandler = async () => {
    await requestLocationPermission(
      async (response) => {
        await getAddress(
          response,
          (result) => {
            setlocation(result);
            setpermission(true);
          },
          (error) => {
            console.log("error", error);
            setpermission(false);
          }
        );
      },
      (err) => {
        console.log("errr", err);
        setpermission(false);
      }
    );
  };

  const onPressGetotp = async () => {
    if (phoneNum.trim().length === 0) {
      infoToast("Please enter your phone number");
    } else if (phoneNum.trim().length !== 10) {
      infoToast("Please enter valid phone number");
    } else {
      let obj;
      let locationObj;
      {
        ispermission
          ? ((locationObj = {
              data: {
                phone: phoneNum,
                name: "",
                state: {
                  state_id: "",
                  state_name: "",
                },
                district: {
                  district_id: "",
                  district_name: "",
                },
                city: {
                  city_id: "",
                  city_name: "",
                },
              },
              onSuccess: (res: any) => {
                navigation.navigate(screenName.OptVerification, {
                  phone: phoneNum,
                });
              },
              onFailure: () => {},
            }),
            location?.results[0]?.address_components?.map((item) => {
              if (item?.types.includes("locality")) {
                locationObj["data"]["city"]["city_id"] =
                  location?.results[location?.results.length - 4]?.place_id;
                locationObj["data"]["city"]["city_name"] = item?.long_name;
              }
              if (item?.types.includes("administrative_area_level_1")) {
                locationObj["data"]["state"]["state_id"] =
                  location?.results[location?.results.length - 2]?.place_id;
                locationObj["data"]["state"]["state_name"] = item?.long_name;
              }
              if (item?.types.includes("administrative_area_level_3")) {
                locationObj["data"]["district"]["district_id"] =
                  location?.results[location?.results.length - 3]?.place_id;
                locationObj["data"]["district"]["district_name"] =
                  item?.long_name;
              }
            }),
            dispatch(sendVerifyCode(locationObj)))
          : ((obj = {
              data: {
                phone: phoneNum,
              },
              onSuccess: (res: any) => {
                navigation.navigate(screenName.OptVerification, {
                  phone: phoneNum,
                });
              },
              onFailure: () => {},
            }),
            dispatch(sendVerifyCode(obj)));
      }
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid
        enableAutomaticScroll
        extraScrollHeight={isIos ? 20 : 360}
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
                placeholder=""
                input_style={styles?.input_style}
                onTextChange={setphoneNum}
              />
              <TouchableOpacity
                style={styles?.otp_btn}
                onPress={() => onPressGetotp()}
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
