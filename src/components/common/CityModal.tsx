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

const CityModal = () => {
  const [IsModal, setIsModal] = useState(true);
  const [value, setValue] = useState(null);
  const data = [
    { label: "Item 1", value: "1" },
    { label: "Item 2", value: "2" },
    { label: "Item 3", value: "3" },
    { label: "Item 4", value: "4" },
    { label: "Item 5", value: "5" },
    { label: "Item 6", value: "6" },
    { label: "Item 7", value: "7" },
    { label: "Item 8", value: "8" },
  ];
  return (
    <View style={styles.conatiner}>
      <Modals
        visible={IsModal}
        close={setIsModal}
        containerStyle={styles.conatiner}
        containStyle={styles.containStyle}
        contain={
          <View style={styles.modal_container}>
            <Text style={styles.title}>{strings.Select_your_City}</Text>
            <View style={styles.details_container}>
              <Text style={styles.details}>
                {
                  strings[
                    "Our service is available for Chandigarh, Mohali,Kharar, Panchkula and Zirakpur only."
                  ]
                }
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
              valueField="value"
              placeholder="Please select"
              value={value}
              onChange={({ item }: any) => {
                setValue(item.value);
              }}
              renderRightIcon={() => <Dropdown_Down_Arrow color="#9D9D9D" />}
            />
            <TouchableOpacity
              style={styles.submit_btn}
              onPress={() => setIsModal(!IsModal)}
            >
              <ImageBackground source={images.book_home} resizeMode="stretch">
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
    marginHorizontal: wp(16),
    width: "90%",
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
  },
  details: {
    ...commonFontStyle(fontFamily.semi_bold, 14, colors.grey_9),
    textAlign: "center",
    marginTop: hp(28),
  },
  select_title: {
    ...commonFontStyle(fontFamily.semi_bold, 16, colors.black),
    marginTop: hp(45),
  },
  details_dark: {
    ...commonFontStyle(fontFamily.semi_bold, 15, colors.black),
  },
  details_container: {
    alignItems: "center",
  },
  dropdown: {
    height: 50,
    borderBottomColor: colors.review_card_bg,
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
    fontSize: 16,
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
});
