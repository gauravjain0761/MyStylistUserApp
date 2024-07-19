import React, { useEffect, useState } from "react";
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
import { hp, infoToast, wp } from "../../helper/globalFunction";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import {
  GpsLocationIcon,
  PlusIcon,
  RightArrowIcon,
  SearchIcon2,
} from "../../theme/SvgIcon";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { screenName } from "../../helper/routeNames";
import { images } from "../../theme/icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  addAddress,
  deleteAddress,
  editAddress,
  getUserAddresses,
  updateLocation,
} from "../../actions";
import {
  getAsyncCoord,
  getAsyncUserInfo,
  setAsyncIsAddressed,
  setAsyncLocation,
} from "../../helper/asyncStorage";
import { SET_DEFAULT_ADDRESS } from "../../actions/dispatchTypes";

const SelectLocation = ({}) => {
  const dispatch = useAppDispatch();
  const { navigate, goBack } = useNavigation();
  const [isAddModal, setIsAddModal] = useState(false);
  const [selectType, setSelectType] = useState("Home");
  const { addressList } = useAppSelector((state) => state.address);
  const [house, setHouse] = useState("");
  const [sector, setSector] = useState("");
  const [landmark, setlandMark] = useState("");
  const [pincode, setPincode] = useState("");
  const [type, setType] = useState("Add");
  const [editData, seteditData] = useState({});
  const [address, setAddress] = useState([]);
  const isFocused = useIsFocused();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getList();
  }, [isFocused]);

  useEffect(() => {
    setAddress(addressList?.addresses);
  }, [addressList?.addresses]);

  const getList = async () => {
    let userInfo = await getAsyncUserInfo();
    let obj = {
      isLoading: true,
      data: {
        userId: userInfo?._id,
      },
      onSuccess: (responce) => {
        // getLocation();
        seteditData(responce?.addresses);
      },
      onFailure: () => {},
    };
    dispatch(getUserAddresses(obj));
  };

  const onPressCurrentLocation = () => {
    // @ts-ignore
    navigate(screenName.ConfirmAddress);
  };

  const onPressAddNew = () => {
    setIsAddModal(true);
    setType("Add");
  };

  const onPressLabel = (type: string) => setSelectType(type);

  const onPressSave = async () => {
    let userInfo = await getAsyncUserInfo();
    let coord = await getAsyncCoord();
    let obj = {
      data: {
        userId: userInfo?._id,
        addressData: {
          addressType: selectType,
          houseNumber: house,
          sector: sector,
          pinCode: pincode,
          landmark: landmark,
          location: {
            type: "Point",
            coordinates: [coord.latitude, coord.longitude],
          },
          isDefault: true,
        },
      },
      onSuccess: () => {
        setIsAddModal(false);
        setHouse("");
        setSector("");
        setlandMark("");
        setPincode("");
        getList();
      },
      onFailure: (Err) => {
        // getList();
        infoToast(Err.data.error);
      },
    };
    if (house.trim().length < 0) {
      infoToast("Enter House num");
    } else if (sector.trim().length < 0) {
      infoToast("Enter Sector");
    } else if (pincode.trim().length < 0) {
      infoToast("Enter Pincode");
    }

    let editobj = {
      data: {
        addressId: editData[0]?._id,
        userId: userInfo?._id,
        addressData: {
          addressType: selectType,
          houseNumber: house,
          sector: sector,
          pinCode: pincode,
          landmark: landmark,
          location: {
            type: "Point",
            coordinates: [coord.latitude, coord.longitude],
          },
          isDefault: true,
        },
      },
      onSuccess: () => {
        setIsAddModal(false);
        setHouse("");
        setSector("");
        setlandMark("");
        setPincode("");
        getList();
      },
      onFailure: (Err) => {
        getList();
        infoToast(Err.data.error);
      },
    };
    if (house.trim().length < 0) {
      infoToast("Enter House num");
    } else if (sector.trim().length < 0) {
      infoToast("Enter Sector");
    } else if (pincode.trim().length < 0) {
      infoToast("Enter Pincode");
    }

    if (type === "Edit") {
      dispatch(editAddress(editobj));
    } else {
      dispatch(addAddress(obj));
    }
    console.log(editData[0]?._id);
  };

  const onPressEditItem = async (item: any) => {
    setType("Edit");
    setIsAddModal(true);
    setHouse(item?.address?.houseNumber);
    setSector(item?.address?.sector);
    setPincode(item?.address?.pinCode);
    setlandMark(item?.address?.landmark);
    setSelectType(item?.address?.addressType);
  };

  const onPressDeleteItem = async (item: any) => {
    let userInfo = await getAsyncUserInfo();
    let obj = {
      data: {
        userId: userInfo._id,
        // userId: "65eed0259e6593d24b2a5210",
        addressId: item?._id,
      },
      onSuccess: () => {
        getList();
      },
      onFailure: (error: any) => {
        infoToast(error?.data?.error);
      },
    };
    dispatch(deleteAddress(obj));
  };

  const fillterAddress = (data) => {
    setSearchQuery(data);
    if (data) {
      let newdata = address?.filter((item) => {
        return item?.address?.houseNumber
          ?.toLowerCase()
          ?.includes(data?.toLowerCase());
      });
      setAddress(newdata);
    } else {
      setAddress(addressList?.addresses);
    }
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
            value={searchQuery}
            onChangeText={(e) => fillterAddress(e)}
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
      {addressList?.addresses?.length ? (
        <FlatList
          data={address || []}
          renderItem={({ item, index }) => {
            return (
              <AddressItem
                data={item}
                onPressEdit={() => onPressEditItem(item)}
                onPressDelete={() => onPressDeleteItem(item)}
                onPressSetDefault={async () => {
                  dispatch({
                    type: SET_DEFAULT_ADDRESS,
                    payload: item?.address?.houseNumber || "",
                  });
                  await setAsyncIsAddressed(true);
                  await setAsyncLocation(item?.address?.houseNumber);
                  goBack();
                }}
              />
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text style={styles.noDataTextStyle}>{"No Data found"}</Text>
      )}

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
                value={house}
                onChangeText={setHouse}
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
                value={sector}
                onChangeText={setSector}
              />
            </View>
            <View>
              <Text style={styles.inputLabelTextStyle}>
                {strings["Pincode"]}
              </Text>
              <TextInput
                style={styles.inputStyle}
                placeholder={strings["Enter here"]}
                placeholderTextColor={"#A7A7A7"}
                value={pincode}
                onChangeText={setPincode}
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
                value={landmark}
                onChangeText={setlandMark}
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
  noDataTextStyle: {
    ...commonFontStyle(fontFamily.medium, 14, colors.black),
    textAlign: "center",
  },
});

export default SelectLocation;
