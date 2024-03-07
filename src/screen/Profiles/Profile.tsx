import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Pressable,
  ScrollViewComponent,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { BackHeader } from "../../components";
import { strings } from "../../helper/string";
import { images } from "../../theme/icons";
import { hp, isIos, wp } from "../../helper/globalFunction";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";
import { Dropdown } from "react-native-element-dropdown";
import {
  CalenderIcon,
  Dropdown_Down_Arrow,
  EditIcon,
} from "../../theme/SvgIcon";
import DatePicker from "react-native-date-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import moment from "moment";

const Profile = () => {
  const [value, setValue] = useState("Male");
  const [isEditable, setIsEditable] = useState(false);
  const [name, setName] = useState("Elisha Atif");
  const [email, setEmail] = useState("elishaatif8974@gmail.com");
  const [phone, setPhone] = useState("+1 435 9877 9856");
  const [date, setDate] = useState("Nov 23, 2023");
  const [dates, setDates] = useState(new Date());
  const [open, setOpen] = useState(false);

  const data = [
    { label: "Male", value: "1" },
    { label: "Female", value: "2" },
  ];

  const onPressNo = () => {
    setIsEditable(!isEditable);
    setName("Elisha Atif");
    setEmail("elishaatif8974@gmail.com");
    setPhone("+1 435 9877 9856");
    setDate("Nov 23, 2023");
  };

  const onPressYes = () => {
    setIsEditable(!isEditable);
  };

  const onPressDate = (item) => {
    const originalDate = item;
    const formattedDate = moment(originalDate).format("MMM DD, YYYY");
    setDate(formattedDate);
  };

  return (
    <View style={styles.container}>
      <BackHeader title={strings.Personal_Information} />
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableAutomaticScroll
        extraScrollHeight={isIos ? 20 : 200}
        keyboardShouldPersistTaps={"handled"}
        style={{ flex: 1 }}
      >
        <TouchableOpacity
          onPress={() => setIsEditable(true)}
          style={styles.edit_btn}
        >
          <EditIcon />
          <Text style={styles.edit_title}>Edit</Text>
        </TouchableOpacity>
        <Image source={images.profile} style={styles.profile_pic} />
        <View style={styles.inputs_conatiner}>
          <View style={styles.input_conatiner}>
            <Text style={styles.lable}>{strings.Full_Name}</Text>
            <TextInput
              editable={isEditable}
              style={styles.input}
              value={name}
              onChangeText={(e) => setName(e)}
            />
          </View>

          <View style={styles.input_conatiner}>
            <Text style={styles.lable}>{strings.Email_Address}</Text>
            <TextInput
              editable={isEditable}
              style={styles.input}
              value={email}
              onChangeText={(e) => setEmail(e)}
            />
          </View>

          <View style={styles.input_conatiner}>
            <Text style={styles.lable}>{strings.Phone_Number}</Text>
            <TextInput
              editable={isEditable}
              style={styles.input}
              value={phone}
              onChangeText={(e) => setPhone(e)}
            />
          </View>

          <View style={styles.input_conatiner}>
            <Text style={styles.lable}>{strings.Gender}</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              iconStyle={styles.iconStyle}
              data={data}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={value}
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={styles.item_style}
              value={value}
              disable={!isEditable}
              onChange={(item: any) => {
                setValue(item.value);
              }}
              renderRightIcon={() => <Dropdown_Down_Arrow color="#9D9D9D" />}
            />
          </View>

          <View style={styles.input_conatiner}>
            <Text style={styles.lable}>{strings.Dat_of_Birth}</Text>
            <Pressable style={[styles.input, styles.Custom_input]}>
              <TextInput
                style={styles.value}
                editable={isEditable}
                value={date}
                onChangeText={(e) => setDate(e)}
              />
              <TouchableOpacity
                disabled={!isEditable}
                onPress={() => setOpen(true)}
              >
                <CalenderIcon />
              </TouchableOpacity>
            </Pressable>
            <DatePicker
              modal
              mode="date"
              open={open}
              date={dates}
              onConfirm={(datess: any) => {
                setOpen(false);
                onPressDate(datess);
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
      {isEditable && (
        <View style={styles.btn_conatiner}>
          <TouchableOpacity onPress={onPressNo}>
            <ImageBackground resizeMode="stretch" source={images.gery_button}>
              <Text style={styles.btn_title}>Cancel</Text>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressYes}>
            <ImageBackground resizeMode="stretch" source={images.blue_button}>
              <Text style={styles.btn_title}>Save</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profile_pic: {
    width: wp(128),
    height: wp(128),
    alignSelf: "center",
    marginTop: hp(23),
  },
  inputs_conatiner: {
    marginHorizontal: wp(20),
    marginVertical: hp(26),
    gap: hp(20),
  },
  input_conatiner: {
    gap: hp(10),
  },

  lable: {
    ...commonFontStyle(fontFamily.semi_bold, 16, colors.black),
  },
  input: {
    borderWidth: 1,
    borderRadius: wp(6),
    borderColor: colors.review_caed_border,
    backgroundColor: colors.review_card_bg,
    paddingHorizontal: wp(18),
    ...commonFontStyle(fontFamily.medium, 16, colors.black),
  },
  dropdown: {
    height: 50,
    backgroundColor: colors.review_card_bg,
    borderWidth: wp(1),
    borderColor: colors.review_caed_border,
    borderRadius: wp(6),
    paddingHorizontal: wp(16),
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    ...commonFontStyle(fontFamily.regular, 16, colors.black),
  },
  selectedTextStyle: {
    ...commonFontStyle(fontFamily.regular, 16, colors.black),
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  item_style: {
    ...commonFontStyle(fontFamily.regular, 16, colors.black),
  },
  value: {
    color: colors.black,
    width: "90%",
  },
  Custom_input: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(10),
  },
  edit_btn: {
    borderWidth: 1,
    borderColor: colors.gery_6,
    borderRadius: wp(6),
    paddingHorizontal: wp(10),
    paddingVertical: hp(5),
    flexDirection: "row",
    alignItems: "center",
    gap: wp(6),
    alignSelf: "flex-end",
    marginRight: wp(20),
    marginTop: hp(10),
  },
  edit_title: {
    ...commonFontStyle(fontFamily.medium, 16, colors.gery_6),
  },
  btn_title: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black_2),
    paddingHorizontal: wp(60),
    paddingVertical: hp(20),
  },
  btn_conatiner: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: wp(12),
    backgroundColor: colors.white,
    paddingVertical: hp(27),
  },
});
