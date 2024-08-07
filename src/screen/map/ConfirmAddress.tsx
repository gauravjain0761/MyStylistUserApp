import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  TextInput,
  FlatList,
  Alert,
} from "react-native";
import { colors } from "../../theme/color";
import { BackHeader, Modals } from "../../components";
import { strings } from "../../helper/string";
import MapView, { MapPressEvent, Marker } from "react-native-maps";
import { icons, images } from "../../theme/icons";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { hp, infoToast, wp } from "../../helper/globalFunction";
import { SearchIcon2 } from "../../theme/SvgIcon";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { api } from "../../helper/apiConstants";
import {
  getAddress,
  requestLocationPermission,
} from "../../helper/locationHandler";
import { COORD, SET_DEFAULT_ADDRESS } from "../../actions/dispatchTypes";
import { getAsyncUserInfo, setAsyncCoord } from "../../helper/asyncStorage";
import { useRoute } from "@react-navigation/native";
import { addAddress, editAddress } from "../../actions";

let initialRegion = {
  latitude: 30.7001323,
  longitude: 76.6990172,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const ConfirmAddress = ({ navigation }) => {
  const { params }: any = useRoute();
  const { location } = useAppSelector((state) => state?.address);
  const { coord } = useAppSelector((state) => state?.location);
  const [coords, setcoords] = useState(coord);
  const [value, setValue] = useState("");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isAddModal, setIsAddModal] = useState(false);
  const [selectType, setSelectType] = useState("Home");
  const [landmark, setlandMark] = useState("");
  const [house, setHouse] = useState("");
  const [pincode, setPincode] = useState("");

  const dispatch = useAppDispatch();

  const mapRef = React.useRef<MapView | null>(null);

  const OLA_API_KEY = api?.MAP_KEY;
  const OLA_API_URL = "https://api.olamaps.io/places/v1/autocomplete";

  useEffect(() => {
    if (params?.isEdit) {
      let data = {
        latitude: params.item?.address?.location?.coordinates?.[0],
        longitude: params.item?.address?.location?.coordinates?.[1],
      };
      setValue(params.item?.address?.sector);
      setPincode(params.item?.address?.pinCode);
      setHouse(params.item?.address?.houseNumber);
      setSelectType(params.item?.address?.addressType);
      setlandMark(params.item?.address?.landmark);
      setcoords(data);
      animateToInitialRegion(data);
      setAddressUsingAPI(data);
    } else {
      getCurreentLocation();
    }
  }, []);

  const getCurreentLocation = async () => {
    await requestLocationPermission(
      async (response) => {
        let data = {
          latitude: response?.latitude,
          longitude: response?.longitude,
        };
        setcoords(data);
        animateToInitialRegion(data);
        setAddressUsingAPI(data);
      },
      (err) => {
        console.log("err", err);
      }
    );
  };

  const setAddressUsingAPI = async (data: any) => {
    await getAddress(
      data,
      (response: any) => {
        let address_components =
          response?.results?.[0]?.address_components || [];
        let pincode = address_components?.filter(
          (i: any) => i.types?.[0] === "postal_code"
        );
        setPincode(pincode?.[0]?.long_name || "");
        setValue(response?.results[0]?.formatted_address);
        setcoords(data);
      },
      (err) => {
        console.log("map", err);
      }
    );
  };

  const onPressEdit = async () => {
    setIsAddModal(true);
    // navigation.pop(2);
  };

  const fetchSuggestions = async (input) => {
    try {
      const response = await fetch(
        `${OLA_API_URL}?location=${coords?.latitude},${coords?.longitude}&input=${input}&api_key=${OLA_API_KEY}`
      );
      const data = await response.json();
      setSuggestions(data.predictions);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const handleSelectSuggestion = async (suggestion) => {
    let data = {
      latitude: suggestion?.geometry?.location?.lat,
      longitude: suggestion?.geometry?.location?.lng,
    };
    animateToInitialRegion(data);
    setcoords(data);
    setSuggestions([]);
    setAddressUsingAPI(data);
    setQuery(suggestion.description);
  };

  const textChange = (text: any) => {
    setQuery(text);
    if (text.length > 1) {
      fetchSuggestions(text?.toLowerCase());
    } else {
      setSuggestions([]);
    }
  };

  const animateToInitialRegion = (center) => {
    if (mapRef.current) {
      mapRef.current.animateCamera(
        {
          center: center,
          pitch: 0,
          heading: 0,
          altitude: 1000,
          zoom: 10,
        },
        { duration: 1000 }
      );
    }
  };

  const onPressLabel = (type: string) => setSelectType(type);

  const onPressSave = async () => {
    let userInfo = await getAsyncUserInfo();
    let data = {
      userId: userInfo?.userId,
      addressData: {
        addressType: selectType,
        houseNumber: house,
        sector: value,
        pinCode: pincode,
        landmark: landmark,
        location: {
          type: "Point",
          coordinates: [coords.latitude, coords.longitude],
        },
        isDefault: true,
      },
    };
    if (house?.length === 0) {
      Alert.alert("House / Flat No.", "Please enter your house number");
    } else {
      if (params?.isEdit) {
        let obj = {
          data: { ...data, addressId: params.item?._id },
          onSuccess: async () => {
            setIsAddModal(false);
            setTimeout(() => {
              navigation.goBack();
            }, 400);
          },
          onFailure: (err: any) => {
            infoToast(err?.data?.error);
          },
        };
        dispatch(editAddress(obj));
      } else {
        let obj = {
          data: data,
          onSuccess: async () => {
            await setAsyncCoord(coords);
            dispatch({ type: COORD, payload: coords });
            dispatch({
              type: SET_DEFAULT_ADDRESS,
              payload: value,
            });
            setIsAddModal(false);
            setHouse("");
            setlandMark("");
            setTimeout(() => {
              navigation.goBack();
            }, 400);
          },
          onFailure: (err: any) => {
            infoToast(err?.data?.error);
          },
        };
        dispatch(addAddress(obj));
      }
    }
  };

  return (
    <View style={styles.container}>
      <BackHeader title={strings["Confirm your address"]} />
      <View style={styles.mapViewContainer}>
        <MapView
          ref={mapRef}
          key={api?.MAP_KEY}
          style={styles.mapContainer}
          initialRegion={initialRegion}
          onRegionChangeComplete={(res) => {
            let data = {
              latitude: res.latitude,
              longitude: res.longitude,
            };
            setAddressUsingAPI(data);
          }}
        ></MapView>
        <View pointerEvents="none" style={styles.mapmarkerStyle}>
          <Image
            resizeMode="contain"
            style={styles.markerIconStyle}
            source={icons.location_map}
          />
        </View>
        <View style={styles.autoSearch}>
          <View style={styles?.search_box}>
            <SearchIcon2 />
            <View style={styles?.input}>
              <TextInput
                style={styles.searchTextStyle}
                value={query}
                onChangeText={(text) => {
                  textChange(text);
                }}
                placeholderTextColor={colors.grey_17}
                placeholder={strings["Search for area, street name..."]}
              />
            </View>
          </View>
          <FlatList
            data={suggestions}
            style={styles.listContainerStyle}
            keyboardShouldPersistTaps={"handled"}
            renderItem={({ item, index }: any) => {
              return (
                <TouchableOpacity onPress={() => handleSelectSuggestion(item)}>
                  <Text style={styles.suggestionItem}>{item?.description}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
        <TouchableOpacity
          activeOpacity={1}
          onPress={getCurreentLocation}
          style={styles.useCurrentLoactionContainer}
        >
          <Text style={styles.uselocationTextStyle}>
            {"Use current location"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomStyle}>
        <View>
          <View style={styles.rowBottomStyle}>
            <Image
              resizeMode="contain"
              source={icons.marker_red}
              style={styles.markerStyle}
            />
            <Text style={styles.boldTextStyle}>{value || location}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onPressEdit}>
          <ImageBackground
            resizeMode="contain"
            style={styles.bookImgStyle}
            source={images.book_button}
          >
            <Text style={styles.bookTextStyle}>{"Set address"}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
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
                value={house}
                style={styles.inputStyle}
                onChangeText={setHouse}
                placeholderTextColor={"#A7A7A7"}
                placeholder={strings["Enter here"]}
              />
            </View>

            <View>
              <Text style={styles.inputLabelTextStyle}>
                {strings["Landmark (optional)"]}
              </Text>
              <TextInput
                value={landmark}
                style={styles.inputStyle}
                onChangeText={setlandMark}
                placeholderTextColor={"#A7A7A7"}
                placeholder={strings["Enter here"]}
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
  mapContainer: {
    flex: 1,
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
  rowBottomStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  markerStyle: {
    height: wp(22),
    width: wp(22),
  },
  boldTextStyle: {
    ...commonFontStyle(fontFamily.regular, 17, "#313131"),
    marginHorizontal: wp(5),
  },
  addressTextStyle: {
    ...commonFontStyle(fontFamily.regular, 15, "#7C7C7C"),
    marginLeft: wp(25),
    marginTop: hp(5),
    marginBottom: hp(15),
  },
  search_icon: {
    width: wp(24),
    height: wp(24),
    marginLeft: wp(16),
  },
  input: {
    marginLeft: wp(5),
    width: "100%",
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
    marginTop: hp(15),
    width: "100%",
  },
  searchTextStyle: {
    ...commonFontStyle(fontFamily.regular, 15, colors.grey_17),
    top: 1,
    height: hp(41),
    width: "90%",
  },
  mapViewContainer: {
    flex: 1,
  },
  textInput: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingLeft: 8,
    fontSize: 16,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    ...commonFontStyle(fontFamily.regular, 15, colors.grey_17),
  },
  autoSearch: {
    position: "absolute",
    width: "90%",
    alignSelf: "center",
  },
  listContainerStyle: {
    backgroundColor: colors?.white,
    marginTop: hp(10),
    maxHeight: hp(250),
    zIndex: 1,
    borderRadius: wp(8),
    overflow: "hidden",
  },
  mapmarkerStyle: {
    position: "absolute",
    top: "50%",
    bottom: "50%",
    alignSelf: "center",
    marginTop: -hp(30),
  },
  markerIconStyle: {
    height: wp(30),
    width: wp(30),
  },
  useCurrentLoactionContainer: {
    position: "absolute",
    bottom: hp(10),
    alignSelf: "center",
    borderWidth: 2,
    paddingHorizontal: wp(15),
    paddingVertical: hp(8),
    borderRadius: 10,
    backgroundColor: colors.white,
    borderColor: colors.primary_light_blue,
  },
  uselocationTextStyle: {
    ...commonFontStyle(fontFamily.regular, 15, colors.black),
  },
  labelTextStyle: {
    ...commonFontStyle(fontFamily.regular, 13, colors.stylists_title_gray),
  },
  rowLabelContaier: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowLabelStyle: {
    marginVertical: hp(14),
    marginRight: wp(10),
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
  inputLabelTextStyle: {
    ...commonFontStyle(fontFamily.regular, 16, colors.black),
    marginTop: hp(15),
  },
});

export default ConfirmAddress;
