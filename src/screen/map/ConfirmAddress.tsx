import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  TextInput,
  Platform,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from "react-native";
import { colors } from "../../theme/color";
import { BackHeader } from "../../components";
import { strings } from "../../helper/string";
import MapView, { MapPressEvent, Marker } from "react-native-maps";
import { icons, images } from "../../theme/icons";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { hp, wp } from "../../helper/globalFunction";
import { SearchIcon2 } from "../../theme/SvgIcon";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { api } from "../../helper/apiConstants";
import {
  getAddress,
  requestLocationPermission,
} from "../../helper/locationHandler";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { getAsyncUserInfo } from "../../helper/asyncStorage";
import { setLocation } from "../../actions";
import { useNavigation } from "@react-navigation/native";
import { debounce } from "lodash";
import { SET_DEFAULT_ADDRESS } from "../../actions/dispatchTypes";

const ConfirmAddress = ({ navigation }) => {
  const { location } = useAppSelector((state) => state?.address);
  const { coord } = useAppSelector((state) => state?.location);
  const [coords, setcoords] = useState(coord);
  const [value, setValue] = useState("");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState([]);
  const dispatch = useAppDispatch();
  const { goBack } = useNavigation();

  const mapRef = React.useRef<MapView | null>(null);

  const OLA_API_KEY = api?.MAP_KEY;
  const OLA_API_URL = "https://api.olamaps.io/places/v1/autocomplete";

  const locations = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  const [position, setPostion] = useState(locations);

  useEffect(() => {
    getCurreentLocation();
  }, []);

  const getCurreentLocation = async () => {
    await requestLocationPermission(
      async (response) => {
        setcoords({
          latitude: response?.latitude,
          longitude: response?.longitude,
        });
        animateToInitialRegion({
          latitude: response?.latitude,
          longitude: response?.longitude,
        });
        setPostion(response);
      },
      (err) => {
        console.log("err", err);
      }
    ).then(async () => {
      await getAddress(
        locations,
        (response: any) => {
          setAddress(response);
          setValue(response?.results[0]?.formatted_address);
        },
        (err) => {
          console.log("map", err);
        }
      );
    });
  };

  const onPressEdit = async () => {
    dispatch({
      type: SET_DEFAULT_ADDRESS,
      payload: value,
    });
    navigation.pop(2);
  };

  const fetchSuggestions = async (input) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${OLA_API_URL}?location=${coords?.latitude},${coords?.longitude}&input=${input}&api_key=${OLA_API_KEY}`
      );
      const data = await response.json();
      setSuggestions(data.predictions);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSuggestion = async (suggestion) => {
    let coords = {
      latitude: suggestion?.geometry?.location?.lat,
      longitude: suggestion?.geometry?.location?.lng,
      latitudeDelta: 0.0822,
      longitudeDelta: 0.0821,
    };
    animateToInitialRegion({
      latitude: suggestion?.geometry?.location?.lat,
      longitude: suggestion?.geometry?.location?.lng,
    });
    setPostion(coords);
    setcoords({
      latitude: suggestion?.geometry?.location?.lat,
      longitude: suggestion?.geometry?.location?.lng,
    });
    setSuggestions([]);
    await getAddress(
      {
        latitude: suggestion?.geometry?.location?.lat,
        longitude: suggestion?.geometry?.location?.lng,
        latitudeDelta: 0.0822,
        longitudeDelta: 0.0821,
      },
      (response: any) => {
        setAddress(response);
        setValue(response?.results[0]?.formatted_address);
      },
      (err) => {
        console.log("map Screen", err);
      }
    );
    setQuery(suggestion.description);
  };

  const handleMapPress = async (event: MapPressEvent) => {
    event.persist();
    await getAddress(
      event.nativeEvent.coordinate,
      (response: any) => {
        setAddress(response);
        setValue(response?.results[0]?.formatted_address);
        const newlocations = {
          latitude: Number(
            event?.nativeEvent?.coordinate?.latitude || 37.4220936
          ),
          latitudeDelta: 0.0822,
          longitude: Number(
            event?.nativeEvent?.coordinate?.longitude || -122.083922
          ),
          longitudeDelta: 0.0821,
        };
        setPostion(newlocations);
        setcoords({
          latitude: newlocations?.latitude,
          longitude: newlocations?.longitude,
        });
      },
      (erro) => {
        console.log("eeeee", erro);
      }
    );
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

  return (
    <View style={styles.container}>
      <BackHeader title={strings["Confirm your address"]} />

      <View style={styles.mapViewContainer}>
        <MapView
          ref={mapRef}
          key={api?.MAP_KEY}
          style={styles.mapContainer}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={handleMapPress}
        >
          <Marker coordinate={position} />
        </MapView>
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
          <Text style={styles.addressTextStyle}>{value || location}</Text>
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
});

export default ConfirmAddress;
