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
} from "react-native";
import { colors } from "../../theme/color";
import { BackHeader } from "../../components";
import { strings } from "../../helper/string";
import MapView, { MapPressEvent, Marker } from "react-native-maps";
import { icons, images } from "../../theme/icons";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { hp, wp } from "../../helper/globalFunction";
import { SearchIcon2 } from "../../theme/SvgIcon";
import { useAppSelector } from "../../redux/hooks";
import { api } from "../../helper/apiConstants";
import {
  getAddress,
  requestLocationPermission,
} from "../../helper/locationHandler";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const ConfirmAddress = () => {
  const { location } = useAppSelector((state) => state?.address);
  const { coord } = useAppSelector((state) => state?.location);
  const [coords, setcoords] = useState(coord);
  const [value, setValue] = useState("");

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const OLA_API_KEY = api?.MAP_KEY;
  const OLA_API_URL = "https://api.olamaps.io/places/v1/autocomplete";

  const fetchSuggestions = async (input) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${OLA_API_URL}?input=${input}&api_key=${OLA_API_KEY}`
      );
      const data = await response.json();
      setSuggestions(data.predictions);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    // Here you would update the map region and marker based on the selected suggestion
    // For demonstration purposes, we're using hardcoded coordinates
    setRegion({
      latitude: suggestion.geometry.location.lat,
      longitude: suggestion.geometry.location.lng,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    setSuggestions([]);
    setQuery(suggestion.description);
  };

  const locations = {
    latitude: Number(coords?.latitude || 37.4220936),
    latitudeDelta: 0.0922,
    longitude: Number(coords?.longitude || -122.083922),
    longitudeDelta: 0.0421,
  };
  const [position, setPostion] = useState(locations);
  const onPressEdit = () => {};

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
      },
      (err) => {
        console.log("err", err);
      }
    ).then(async () => {
      await getAddress(
        locations,
        (response: any) => {
          setPostion(locations);
          setValue(response?.results[0]?.formatted_address);
        },
        (err) => {
          console.log("map", err);
        }
      );
    });
  };

  const handleMapPress = async (event: MapPressEvent) => {
    event.persist();
    await getAddress(
      event.nativeEvent.coordinate,
      (response: any) => {
        setValue(response?.results[0]?.formatted_address);
        const newlocations = {
          latitude: Number(event.nativeEvent.coordinate.latitude || 37.4220936),
          latitudeDelta: 0.0922,
          longitude: Number(
            event.nativeEvent.coordinate.longitude || -122.083922
          ),
          longitudeDelta: 0.0421,
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

  return (
    <View style={styles.container}>
      <BackHeader title={strings["Confirm your address"]} />

      <View style={styles.mapViewContainer}>
        <MapView
          initialRegion={position}
          region={position}
          key={api?.MAP_KEY}
          showsMyLocationButton={false}
          followsUserLocation={true}
          style={styles.mapContainer}
          zoomEnabled
          loadingEnabled={true}
          onPress={handleMapPress}
        >
          <Marker flat={false} coordinate={position} />
        </MapView>
        <GooglePlacesAutocomplete
          placeholder={strings["Search for area, street name..."]}
          fetchDetails={true}
          styles={{
            textInput: {
              width: "100%",
              backgroundColor: colors?.white,
              height: "100%",
            },
            container: {
              backgroundColor: colors?.white,
              borderWidth: 1,
              borderColor: colors?.gray_border,
              borderRadius: wp(8),
              justifyContent: "center",
              paddingHorizontal: wp(10),
              marginVertical: hp(15),
              position: "absolute",
              width: "90%",
              alignSelf: "center",
              alignItems: "center",
            },
          }}
          textInputProps={styles?.searchTextStyle}
          onPress={(data, details = null) => {
            console.log(data, details);
          }}
          renderLeftButton={() => (
            <View style={styles?.search_icon}>
              <SearchIcon2 />
            </View>
          )}
          query={{
            key: api?.MAP_KEY,
            language: "en",
            type: "establishment",
            components: "country:in",
            radius: 50000,
          }}
        />
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
            <Text style={styles.bookTextStyle}>
              {strings["Edit complete address"]}
            </Text>
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
    // marginLeft: wp(16),
    top: hp(10),
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
    position: "absolute",
    width: "90%",
    alignSelf: "center",
  },
  searchTextStyle: {
    ...commonFontStyle(fontFamily.regular, 15, colors.grey_17),
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
  },
});

export default ConfirmAddress;
