import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { BackHeader } from "../../components";
import { strings } from "../../helper/string";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";
import { commonFontStyle } from "../../theme/fonts";
import {
  dispatchNavigation,
  hp,
  screen_height,
  wp,
} from "../../helper/globalFunction";
import { DirectionIcon } from "../../theme/SvgIcon";
import { requestLocationPermission } from "../../helper/locationHandler";
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from "react-native-google-places-autocomplete";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/core";
import { screenName } from "../../helper/routeNames";
import { values } from "lodash";

const MapLocation = () => {
  const [coord, setcoord] = useState("");
  const [value, setValue] = useState("");
  const { navigate } = useNavigation();
  const location = {
    latitude: Number(coord.split("|")[0] || 37.4220936),
    latitudeDelta: 0.0922,
    longitude: Number(coord.split("|")[1] || -122.083922),
    longitudeDelta: 0.0421,
  };
  const [position, setPostion] = useState(location);
  useEffect(() => {
    onPressCurruntLocation();
  }, []);

  const ref = useRef<GooglePlacesAutocompleteRef>();

  const onPressCurruntLocation = async () => {
    await requestLocationPermission(
      (response) => {
        setcoord(`${response?.latitude}|${response?.longitude}`);
        // console.log("response location", response);
      },
      (err) => {
        console.log("err", err);
      }
    ).then(() => {
      getAddress(location);
    });
  };

  const getAddress = async (region: any) => {
    const headersList = {};
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${region.latitude},${region.longitude}&key=AIzaSyAtgC47qVsVhvtu_GgKNQfSIEtq1a9hPAU`,
      {
        method: "GET",
        headers: headersList,
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        setPostion(region);
        // mapRef?.current?.animateToRegion(region, 2000);
        setValue(data?.results[0]?.formatted_address);
      })
      .catch((error) => {
        console.log("Map error", error);
      })
      .then(() => {});
  };

  const onRegionChangeComplete = (region, gesture) => {
    if (Platform.OS === "android") {
      if (gesture.isGesture) {
        getAddress(region);
      }
    } else {
      getAddress(region);
    }
  };

  const handleMapPress = (event) => {
    setcoord(
      `${event.nativeEvent.coordinate?.latitude}|${event.nativeEvent.coordinate?.longitude}`
    );
  };

  const onPressConfirm = () => {
    navigate(screenName.Home, { locations: value });
  };

  return (
    <View style={styles.conatiner}>
      <BackHeader title={strings?.Confirm_location} />
      <ScrollView contentContainerStyle={styles.map_conatiner}>
        <MapView
          initialRegion={position}
          region={position}
          style={styles?.map}
          loadingEnabled={true}
          onRegionChangeComplete={(region, gesture) => {
            onRegionChangeComplete(region, gesture);
          }}
        >
          <Marker flat={true} coordinate={position} />
        </MapView>
        <View style={styles.positionContainer}>
          <GooglePlacesAutocomplete
            placeholder="Search"
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              console.log(data, details);
            }}
            query={{
              key: "AIzaSyAtgC47qVsVhvtu_GgKNQfSIEtq1a9hPAU",
              language: "en",
              type: "establishment",
              components: "country:in",
            }}
            enablePoweredByContainer={false}
            styles={{
              container: {
                height: "auto",
                maxHeight: screen_height / 3,
              },
            }}
          />
        </View>

        <Pressable
          style={styles.locationContainer}
          onPress={onPressCurruntLocation}
        >
          <View style={styles.currentLocationBtnStyle}>
            <Text style={styles.currentLocationTextStyle}>
              {"Use current location"}
            </Text>
          </View>
        </Pressable>
      </ScrollView>
      <View style={{ backgroundColor: colors.white }}>
        <View style={styles.addressRowStyle}>
          <DirectionIcon />
          <Text style={styles.addressTextStyle}>{value}</Text>
        </View>

        <TouchableOpacity onPress={onPressConfirm} style={styles.btnContainer}>
          <Text style={styles.btn_title}>Confirm location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MapLocation;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  positionContainer: {
    position: "absolute",
    width: "90%",
    alignSelf: "center",
    zIndex: 1,
    marginTop: 20,
  },
  shadowContainer: {
    margin: 0,
    flex: 1,
    backgroundColor: "yellow",
    paddingVertical: hp(5),
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 15,
    // marginTop: 20,
    maxHeight: hp(300),
  },
  placeholderTextStyle: {
    ...commonFontStyle(fontFamily.regular, 15, colors.grey_13),
  },
  addressRowStyle: {
    flexDirection: "row",
    marginTop: 16,
    marginHorizontal: 16,
  },
  locationIcon: {
    height: 25,
    width: 25,
    marginTop: 1,
    // tintColor: colors,
  },
  btnContainer: {
    paddingHorizontal: "30%",
    paddingVertical: hp(16),
    backgroundColor: colors?.primary_light_blue,
    alignSelf: "center",
    borderRadius: wp(10),
    marginVertical: hp(10),
  },
  addressTextStyle: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    ...commonFontStyle(fontFamily.medium, 16, colors.black_2),
  },
  map_conatiner: {
    height: "100%",
  },
  btn_title: {
    ...commonFontStyle(fontFamily.semi_bold, 16, colors.black),
  },
  locationContainer: {
    alignSelf: "center",
    position: "absolute",
    bottom: hp(12),
  },
  currentLocationBtnStyle: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    padding: wp(10),
    backgroundColor: colors.white,
    borderRadius: wp(10),
  },
  currentLocationTextStyle: {
    ...commonFontStyle(fontFamily.medium, 14, colors.black),
  },
  addressSearchContainer: {
    marginTop: 20,
    flex: 1,
    position: "absolute",
    width: "90%",
    alignSelf: "center",
    zIndex: 1,
  },
});
