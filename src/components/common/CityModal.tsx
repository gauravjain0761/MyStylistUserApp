import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Modals from "./Modals";
import { strings } from "../../helper/string";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";
import { hp, wp } from "../../helper/globalFunction";
import { Dropdown } from "react-native-element-dropdown";
import { Dropdown_Down_Arrow } from "../../theme/SvgIcon";
import { images } from "../../theme/icons";

const CityModal = ({ LocationAllow = null }: any) => {
  const [IsModal, setIsModal] = useState(true);
  const [value, setValue] = useState(null);
  const data = [
    { label: "Chandigarh", value: "1" },
    { label: "Panchkula", value: "2" },
    { label: "Zirakpur", value: "3" },
    { label: "Patiala", value: "4" },
    { label: "Mohali", value: "5" },
    { label: "Rupnagar", value: "6" },
    { label: "Kharar", value: "7" },
  ];
  return (
    <View style={styles.conatiner}>
      <Modals
        visible={IsModal}
        close={setIsModal}
        containerStyle={styles.conatiner}
        containStyle={styles.containStyle}
        IsBackdropPress={false}
        contain={
          <View style={styles.modal_container}>
            <Text style={styles.title}>{strings.Select_your_City}</Text>
            <View style={styles.details_container}>
              <Text style={styles.details}>
                {strings["Our service is available for"]}
                <Text style={styles.details_dark}>
                  {strings["Chandigarh, Mohali,Kharar, Panchkula"]}
                </Text>
                and
                <Text style={styles.details_dark}>{strings["Zirakpur"]}</Text>
                only.
              </Text>
            </View>
            <Text style={styles.select_title}>{strings.Select_City}</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              iconStyle={styles.iconStyle}
              data={data}
              maxHeight={300}
              labelField="label"
              valueField="label"
              placeholder="Please select"
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={styles.item_style}
              value={value}
              onChange={(item: any) => {
                setValue(item.label);
              }}
              renderRightIcon={() => <Dropdown_Down_Arrow color="#9D9D9D" />}
            />
            <TouchableOpacity
              style={styles.submit_btn}
              onPress={() => {
                value != null
                  ? (setIsModal(!IsModal), LocationAllow(value))
                  : null;
              }}
            >
              <ImageBackground source={images.book_button} resizeMode="contain">
                <Text style={styles.btn_title}>{strings.Submit}</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

export default CityModal;

const styles = StyleSheet.create({
  conatiner: {
    justifyContent: "center",
    marginHorizontal: wp(14),
    width: "auto",
    alignItems: "center",
  },
  modal_container: {
    width: "100%",
  },
  title: {
    ...commonFontStyle(fontFamily.semi_bold, 23, colors.black),
    alignSelf: "center",
  },
  containStyle: {
    width: "100%",
    borderBottomLeftRadius: wp(20),
    borderBottomRightRadius: wp(20),
    paddingHorizontal: wp(20),
    backgroundColor: colors.white,
    justifyContent: "center",
    alignSelf: "center",
  },
  details: {
    ...commonFontStyle(fontFamily.semi_bold, 14, colors.grey_9),
    textAlign: "center",
    marginTop: hp(28),
    alignSelf: "center",
    lineHeight: hp(26),
  },
  select_title: {
    ...commonFontStyle(fontFamily.semi_bold, 16, colors.black),
    marginTop: hp(45),
  },
  details_dark: {
    ...commonFontStyle(fontFamily.semi_bold, 14.5, colors.black),
  },
  details_container: {
    alignItems: "center",
    justifyContent: "center",
  },
  dropdown: {
    height: hp(60),
    backgroundColor: colors.review_card_bg,
    borderWidth: wp(1),
    borderColor: colors.review_caed_border,
    borderRadius: wp(6),
    paddingHorizontal: wp(16),
    marginTop: hp(12),
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    ...commonFontStyle(fontFamily.regular, 16, colors.fc_light_gray_2),
  },
  selectedTextStyle: {
    ...commonFontStyle(fontFamily.regular, 16, colors.black),
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  btn_title: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black_2),
    marginVertical: hp(20),
    textAlign: "center",
  },
  submit_btn: {
    marginTop: hp(30),
    width: "100%",
    marginBottom: hp(20),
  },
  item_style: {
    ...commonFontStyle(fontFamily.regular, 16, colors.black),
  },
});
