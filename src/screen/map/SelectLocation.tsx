import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { colors } from "../../theme/color";
import { AddressItem, BackHeader, Modals } from "../../components";
import { strings } from "../../helper/string";
import { hp, wp } from "../../helper/globalFunction";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import {
  GpsLocationIcon,
  PlusIcon,
  RightArrowIcon,
  SearchIcon2,
} from "../../theme/SvgIcon";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "../../helper/routeNames";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { images } from "../../theme/icons";

const SelectLocation = ({}) => {
  const { navigate } = useNavigation();
  const [isAddModal, setIsAddModal] = useState(false);
  const [selectType, setSelectType] = useState("Home");

  const onPressCurrentLocation = () => {
    // @ts-ignore
    navigate(screenName.ConfirmAddress);
  };

  const onPressAddNew = () => {
    setIsAddModal(true);
  };

  const onPressLabel = (type: string) => setSelectType(type);

  const onPressSave = () => {
    setIsAddModal(false);
  };

  return (
    <View style={styles.container}>
      <BackHeader title={strings["Select a location"]} />
      <View style={styles?.search_box}>
        <SearchIcon2 />
        <View style={styles?.input}>
          <TextInput
            style={styles.searchTextStyle}
            placeholderTextColor={colors.grey_17}
            placeholder={strings["Search for area, street name..."]}
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={onPressCurrentLocation}
        style={styles.rowStyle}
      >
        <GpsLocationIcon />
        <Text style={styles.blueTextStyle}>
          {strings["Use my current location"]}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressAddNew} style={styles.whiteContainer}>
        <View style={styles.rowSpaceStyle}>
          <PlusIcon size={25} color="#33BBB1" />
          <Text style={styles.newAddressTextStyle}>
            {strings["Add new address"]}
          </Text>
        </View>
        <RightArrowIcon />
      </TouchableOpacity>
      <View style={styles.lineStyle}>
        <Text style={styles.saveTextStyle}>{strings["SAVED ADDRESSES"]}</Text>
      </View>
      <FlatList
        data={[1, 2, 3]}
        renderItem={({ item, index }) => {
          return <AddressItem />;
        }}
        keyExtractor={(item, index) => index.toString()}
      />
      <Modals
        isIcon
        visible={isAddModal}
        close={setIsAddModal}
        contain={
          <View style={{ width: "100%" }}>
            <Text style={styles.labelTextStyle}>
              {strings["Save address as"]}
            </Text>
            <View style={styles.rowLabelContaier}>
              <View style={styles.rowLabelStyle}>
                <TouchableOpacity onPress={() => onPressLabel("Home")}>
                  <ImageBackground
                    resizeMode="contain"
                    source={
                      selectType === "Home"
                        ? images.label_black
                        : images.label_grey
                    }
                    style={styles.btnStyle}
                  >
                    <Text>{strings["Home"]}</Text>
                  </ImageBackground>
                </TouchableOpacity>
              </View>
              <View style={styles.rowLabelStyle}>
                <TouchableOpacity onPress={() => onPressLabel("Work")}>
                  <ImageBackground
                    resizeMode="contain"
                    source={
                      selectType === "Work"
                        ? images.label_black
                        : images.label_grey
                    }
                    style={styles.btnStyle}
                  >
                    <Text>{strings["Work"]}</Text>
                  </ImageBackground>
                </TouchableOpacity>
              </View>
              <View style={styles.rowLabelStyle}>
                <TouchableOpacity onPress={() => onPressLabel("Other")}>
                  <ImageBackground
                    resizeMode="contain"
                    source={
                      selectType === "Other"
                        ? images.label_black
                        : images.label_grey
                    }
                    style={styles.btnStyle}
                  >
                    <Text>{strings["Other"]}</Text>
                  </ImageBackground>
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <Text style={styles.inputLabelTextStyle}>
                {strings["House / Flat No."]}
              </Text>
              <TextInput
                style={styles.inputStyle}
                placeholder={strings["Enter here"]}
                placeholderTextColor={"#A7A7A7"}
              />
            </View>
            <View>
              <Text style={styles.inputLabelTextStyle}>
                {strings["Sector / Block"]}
              </Text>
              <TextInput
                style={styles.inputStyle}
                placeholder={strings["Enter here"]}
                placeholderTextColor={"#A7A7A7"}
              />
            </View>
            <View>
              <Text style={styles.inputLabelTextStyle}>
                {strings["Landmark (optional)"]}
              </Text>
              <TextInput
                style={styles.inputStyle}
                placeholder={strings["Enter here"]}
                placeholderTextColor={"#A7A7A7"}
              />
            </View>
            <TouchableOpacity onPress={onPressSave}>
              <ImageBackground
                resizeMode="contain"
                style={styles.bookImgStyle}
                source={images.book_button}
              >
                <Text style={styles.bookTextStyle}>
                  {strings["Save address"]}
                </Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background_grey,
  },
  search_icon: {
    width: wp(24),
    height: wp(24),
    marginLeft: wp(16),
  },
  input: {
    marginLeft: wp(5),
  },
  search_box: {
    backgroundColor: colors?.white,
    borderWidth: 1,
    height: hp(41),
    borderColor: colors?.gray_border,
    borderRadius: wp(8),
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: wp(10),
    marginHorizontal: wp(20),
    marginVertical: hp(15),
  },
  searchTextStyle: {
    ...commonFontStyle(fontFamily.medium, 12, "#949495"),
  },
  rowStyle: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(20),
  },
  blueTextStyle: {
    ...commonFontStyle(fontFamily.medium, 15, "#33BBB1"),
    marginHorizontal: wp(5),
  },
  whiteContainer: {
    height: hp(50),
    borderRadius: 8,
    marginVertical: hp(20),
    marginHorizontal: wp(20),
    alignItems: "center",
    paddingHorizontal: wp(13),
    backgroundColor: colors.white,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  newAddressTextStyle: {
    ...commonFontStyle(fontFamily.medium, 17, "#33BBB1"),
    marginHorizontal: wp(5),
  },
  rowSpaceStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  lineStyle: {
    borderTopWidth: 1,
    marginVertical: hp(20),
    marginHorizontal: wp(20),
    borderTopColor: colors.stylists_border_color,
  },
  saveTextStyle: {
    top: -hp(10),
    alignSelf: "center",
    backgroundColor: colors.background_grey,
    ...commonFontStyle(fontFamily.regular, 17, colors.black_2),
    paddingHorizontal: wp(5),
  },
  rowLabelContaier: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowLabelStyle: {
    marginVertical: hp(14),
    marginRight: wp(10),
  },
  labelTextStyle: {
    ...commonFontStyle(fontFamily.regular, 13, colors.stylists_title_gray),
  },
  btnStyle: {
    height: hp(39),
    width: wp(69),
    justifyContent: "center",
    alignItems: "center",
  },
  btnTextStyle: {
    ...commonFontStyle(fontFamily.regular, 13, colors.black_2),
  },
  inputLabelTextStyle: {
    ...commonFontStyle(fontFamily.regular, 16, colors.black),
    marginTop: hp(15),
  },
  inputStyle: {
    height: hp(60),
    borderWidth: 1,
    width: "100%",
    paddingHorizontal: wp(15),
    borderColor: colors.review_caed_border,
    borderRadius: 6,
    marginVertical: hp(10),
    ...commonFontStyle(fontFamily.regular, 16, colors.black),
  },
  bottomStyle: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    backgroundColor: colors.white,
    padding: wp(20),
    paddingBottom: hp(25),
    justifyContent: "center",
  },
  bookImgStyle: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(10),
  },
  bookTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black),
    paddingVertical: hp(20),
    paddingHorizontal: wp(60),
  },
});

export default SelectLocation;
