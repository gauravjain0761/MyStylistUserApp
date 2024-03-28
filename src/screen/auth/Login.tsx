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
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { screenName } from "../../helper/routeNames";
import { useAppDispatch } from "../../redux/hooks";
import {
  NavigationProp,
  NavigationState,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { Citylist, sendVerifyCode } from "../../actions/authAction";
import {
  getAddress,
  requestLocationPermission,
} from "../../helper/locationHandler";
import { Dropdown } from "react-native-element-dropdown";
import { Dropdown_Down_Arrow } from "../../theme/SvgIcon";

const Login: FC = () => {
  const [phoneNum, setphoneNum] = useState<string>("");
  const [name, setname] = useState("");
  const [value, setValue] = useState(null);
  const [city, setcity] = useState<any>([]);
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const [selectedCity, setSelectedCity] = useState<any>({});

  console.log("selectedCity", selectedCity);

  useEffect(() => {
    let obj = {
      onSuccess: (res) => {
        setcity(res);
      },
      onFailure: (err) => {
        console.log("errrr", err);
      },
    };
    dispatch(Citylist(obj));
  }, []);

  console.log("sss", value);
  // const locationHandler = async () => {
  //   await requestLocationPermission(
  //     async (response) => {
  //       await getAddress(
  //         response,
  //         (result) => {
  //           setlocation(result);
  //           setpermission(true);
  //         },
  //         (error) => {
  //           console.log("error", error);
  //           setpermission(false);
  //         }
  //       );
  //     },
  //     (err) => {
  //       console.log("errr", err);
  //       setpermission(false);
  //     }
  //   );
  // };

  const onPressGetotp = async () => {
    if (phoneNum.trim().length === 0) {
      infoToast("Please enter your phone number");
    } else if (phoneNum.trim().length !== 10) {
      infoToast("Please enter valid phone number");
    } else if (name.trim().length === 0) {
      infoToast("Please enter your Name");
    } else if (value == null) {
      infoToast("Please enter your city");
    } else {
      let data = {
        phone: phoneNum,
        name: name,
        state: {
          state_id: selectedCity.state_id,
          state_name: selectedCity.state_name,
        },
        district: {
          district_id: selectedCity.district_id,
          district_name: selectedCity.district_name,
        },
        city: {
          city_id: selectedCity.city_id,
          city_name: selectedCity.city_name,
        },
      };
      let obj = {
        data: data,
        onSuccess: (res: any) => {
          navigation.navigate(screenName.OptVerification, {
            phone: phoneNum,
            data: data,
          });
        },
        onFailure: () => {},
      };
      dispatch(sendVerifyCode(obj));
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid
        enableAutomaticScroll
        extraScrollHeight={isIos ? 20 : 300}
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
          <View style={{ paddingBottom: hp(20) }}>
            <Image
              source={images?.logo}
              style={styles?.logo}
              resizeMode="contain"
            />
          </View>
          <ScrollView
            contentContainerStyle={styles?.modal_container}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles?.welcome_container}>
              <Text style={styles?.welcome_title}>{strings?.Welcome}</Text>
              <Text style={styles?.welcome_contain}>
                {strings?.Today_is_a_new_day}
              </Text>
            </View>
            <View style={styles?.input_container}>
              <Text style={styles?.mobile_title}>{strings?.Full_Name}</Text>
              <Login_Input
                placeholder={strings?.Enter_here}
                input_style={styles?.input_style}
                onTextChange={setname}
                keyboardType="default"
              />
              <Text style={styles?.mobile_title}>{strings?.Mobile_Number}</Text>
              <Login_Input
                placeholder=""
                input_style={styles?.input_style}
                onTextChange={setphoneNum}
              />

              <Text style={styles?.mobile_title}>{strings?.Select_City}</Text>
              <Login_Input
                placeholder=""
                input_style={styles?.input_style}
                custom_component={
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    iconStyle={styles.iconStyle}
                    data={city}
                    maxHeight={300}
                    labelField="city_name"
                    valueField="city_name"
                    placeholder="Please select"
                    selectedTextStyle={styles.selectedTextStyle}
                    itemTextStyle={styles.item_style}
                    value={value}
                    onChange={(item: any) => {
                      setValue(item.city_name);
                      setSelectedCity(item);
                    }}
                    renderRightIcon={() => (
                      <Dropdown_Down_Arrow color="#9D9D9D" />
                    )}
                  />
                }
              />

              <TouchableOpacity
                style={styles?.otp_btn}
                onPress={() => onPressGetotp()}
              >
                <Text style={styles?.otp_btn_title}>{strings?.Get_OTP}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
    marginTop: hp(40),
  },
  welcome_contain: {
    ...commonFontStyle("Inter-Regular", 14.33, colors.fc_light_gray),
    marginTop: hp(7),
  },
  input_container: {
    marginTop: hp(20),
    alignItems: "flex-start",
    // marginHorizontal: wp(51),
  },
  mobile_title: {
    color: colors?.fc_light_gray,
    fontSize: fontSize(16),
    marginBottom: hp(14),
    marginTop: hp(24),
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
    paddingBottom: hp(60),
  },
  input_style: {
    paddingLeft: wp(22),
    color: colors?.fc_light_gray,
  },
  dropdown: {
    height: hp(55),
    borderRadius: wp(6),
    paddingHorizontal: wp(16),
    width: wp(280),
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderStyle: {
    ...commonFontStyle(fontFamily.regular, 16, colors.fc_light_gray_2),
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  submit_btn: {
    marginTop: hp(30),
    width: "100%",
    marginBottom: hp(20),
  },
  item_style: {
    ...commonFontStyle(fontFamily.regular, 16, colors.black),
  },
  selectedTextStyle: {
    ...commonFontStyle(fontFamily.regular, 16, colors.fc_light_gray_2),
  },
});
