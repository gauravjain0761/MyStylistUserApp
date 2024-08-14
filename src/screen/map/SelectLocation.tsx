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
} from "../../actions";
import {
  getAsyncCoord,
  getAsyncLocation,
  getAsyncUserInfo,
  setAsyncCoord,
  setAsyncDefaultLatLng,
  setAsyncIsAddressed,
  setAsyncLocation,
} from "../../helper/asyncStorage";
import {
  COORD,
  CURRENT_COORDS,
  SET_DEFAULT_ADDRESS,
} from "../../actions/dispatchTypes";
import {
  getAddress,
  requestLocationPermission,
} from "../../helper/locationHandler";
import { api } from "../../helper/apiConstants";

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

  const OLA_API_KEY = api?.MAP_KEY;
  const OLA_API_URL = "https://api.olamaps.io/places/v1/autocomplete";

  const getCurreentLocation = async () => {
    let check = await getAsyncLocation();
    if (check) {
      await setAsyncIsAddressed(false);
      dispatch({ type: SET_DEFAULT_ADDRESS, payload: "" });
    }
  };

  useEffect(() => {
    setAddress(addressList?.addresses);
    if (addressList?.addresses?.length === 0) {
      getCurreentLocation();
    }
  }, [addressList?.addresses]);

  const getList = async () => {
    let userInfo = await getAsyncUserInfo();
    let obj = {
      isLoading: true,
      data: {
        userId: userInfo?.userId,
      },
      onSuccess: (responce) => {
        // getLocation();
        seteditData(responce?.addresses);
      },
      onFailure: () => {},
    };
    dispatch(getUserAddresses(obj));
  };

  const onPressCurrentLocation = async () => {
    await requestLocationPermission(
      async (response) => {
        let data = {
          latitude: response?.latitude || 30.6776689,
          longitude: response?.longitude || 76.7233438,
        };
        await getAddress(
          data,
          async (response: any) => {
            await setAsyncCoord(data);
            dispatch({ type: COORD, payload: data });
            dispatch({ type: CURRENT_COORDS, payload: data });
            dispatch({
              type: SET_DEFAULT_ADDRESS,
              payload: response?.results[0]?.formatted_address,
            });
            goBack();
          },
          (err: any) => {
            console.log("map", err);
          }
        );
      },
      (err) => {
        console.log("err", err);
      }
    );
  };

  const onPressAddNew = () => {
    // setIsAddModal(true);
    // setType("Add");
    //@ts-ignore
    navigate(screenName.ConfirmAddress);
  };

  const fetchSuggestions = async (coords) => {
    try {
      const response = await fetch(
        `${OLA_API_URL}?location=${coords?.latitude},${
          coords?.longitude
        }&input=${sector?.toLowerCase()} ${landmark?.toLowerCase()} ${pincode}&api_key=${OLA_API_KEY}`
      );
      const data = await response.json();
      console.log("logggggggg", data);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const onPressEditItem = async (item: any) => {
    // @ts-ignore
    navigate(screenName.ConfirmAddress, { isEdit: true, item });
  };

  const onPressDeleteItem = async (item: any) => {
    let userInfo = await getAsyncUserInfo();
    let obj = {
      data: {
        userId: userInfo?.userId,
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
          renderItem={({ item, index }: any) => {
            return (
              <AddressItem
                data={item}
                onPressEdit={() => onPressEditItem(item)}
                onPressDelete={() => onPressDeleteItem(item)}
                onPressSetDefault={async () => {
                  let data = {
                    latitude: item?.address?.location?.coordinates?.[0],
                    longitude: item?.address?.location?.coordinates?.[1],
                  };
                  let address =
                    item?.address?.houseNumber + ", " + item?.address?.sector ||
                    "";
                  dispatch({
                    type: SET_DEFAULT_ADDRESS,
                    payload: address,
                  });
                  await setAsyncIsAddressed(true);
                  await setAsyncLocation(address);
                  await setAsyncDefaultLatLng(data);
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
