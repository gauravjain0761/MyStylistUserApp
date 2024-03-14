import {
  Image,
  LogBox,
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
import MapView, { Marker } from "react-native-maps";
import { fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";
import { commonFontStyle } from "../../theme/fonts";
import {
  dispatchNavigation,
  hp,
  screen_height,
  wp,
} from "../../helper/globalFunction";
import { CloseIcon, DirectionIcon } from "../../theme/SvgIcon";
import {
  getAddress,
  requestLocationPermission,
} from "../../helper/locationHandler";
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from "react-native-google-places-autocomplete";
import { useNavigation } from "@react-navigation/core";
import { screenName } from "../../helper/routeNames";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { updateLocation } from "../../actions/locationAction";

const MapLocation = () => {
  const coords = useAppSelector((state) => state?.location?.coord);
  const userinfo = useAppSelector((state) => state?.common?.userInfo);
  const dispatch = useAppDispatch();
  const [coord, setcoord] = useState("");
  const [responses, setResponses] = useState({});
  const [value, setValue] = useState("");

  const locations = {
    latitude: Number(coord.split("|")[0] || 37.4220936),
    latitudeDelta: 0.0922,
    longitude: Number(coord.split("|")[1] || -122.083922),
    longitudeDelta: 0.0421,
  };
  const [position, setPostion] = useState(locations);
  useEffect(() => {
    onPressCurruntLocation();
  }, []);

  const ref = useRef<GooglePlacesAutocompleteRef>();

  const onPressCurruntLocation = async () => {
    await requestLocationPermission(
      async (response) => {
        setcoord(`${response?.latitude}|${response?.longitude}`);
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
          setResponses(response);
        },
        (err) => {
          console.log("map", err);
        }
      );
    });
  };

  const onRegionChangeComplete = async (region, gesture) => {
    if (Platform.OS === "android") {
      if (gesture.isGesture) {
        await getAddress(
          region,
          (response) => {
            setValue(response?.results[0]?.formatted_address);
            setPostion(region);
            setResponses(response);
          },
          (erro) => {
            console.log(erro);
          }
        );
      }
    } else {
      await getAddress(region);
    }
  };

  const onPressConfirm = async () => {
    const updatedLocaton = {
      userId: userinfo?._id,
      pinCode:
        responses?.results[0]?.address_components[
          responses?.results[0]?.address_components?.length - 1
        ]?.long_name,
      landmark: "Nearby landmark",
      location: {
        type: responses?.results[0]?.geometry?.location_type,
        coordinates: [
          responses?.results[0]?.geometry?.location?.lat,
          responses?.results[0]?.geometry?.location?.lng,
        ],
      },
    };
    dispatch(updateLocation(updatedLocaton));
  };

  const handleSelectPlace = async (details: any) => {
    const { location } = await details.geometry;
    const newlocations = {
      latitude: Number(location.lat || 37.4220936),
      latitudeDelta: 0.0922,
      longitude: Number(location.lng || -122.083922),
      longitudeDelta: 0.0421,
    };
    await getAddress(
      newlocations,
      (response) => {
        setValue(response?.results[0]?.formatted_address);
        setResponses(response);
        setPostion(newlocations);
        setcoord(`${newlocations?.latitude}|${newlocations?.longitude}`);
      },
      (erro) => {
        console.log(erro);
      }
    );
  };

  return (
    <View style={styles.conatiner}>
      <BackHeader title={strings?.Confirm_location} />
      <View style={styles.map_conatiner}>
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
            ref={ref}
            placeholder="Search"
            fetchDetails={true}
            onPress={(data, details = null) => {
              handleSelectPlace(details);
              setValue(data?.description);
            }}
            renderRightButton={() => {
              return (
                <TouchableOpacity
                  onPress={() => ref?.current?.clear()}
                  style={styles?.closeIconStyle}
                >
                  <CloseIcon />
                </TouchableOpacity>
              );
            }}
            query={{
              key: "AIzaSyAtgC47qVsVhvtu_GgKNQfSIEtq1a9hPAU",
              language: "en",
              type: "establishment",
              components: "country:in",
              radius: 50000,
            }}
            textInputProps={{
              style: styles.inputStyle,
              placeholderTextColor: "#000",
            }}
            styles={{
              container: {
                maxHeight: "90%",
              },
            }}
            enablePoweredByContainer={false}
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
      </View>
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
    flex: 1,
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
    flex: 1,
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
  closeIconStyle: {
    marginTop: hp(12),
    position: "absolute",
    right: 0,
    top: hp(2),
    marginRight: wp(10),
    backgroundColor: colors?.white,
  },
  inputStyle: {
    margin: 0,
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 15,
    borderRadius: 10,
    flexDirection: "row",
    paddingLeft: wp(10),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 15,
    height: 50,
    ...commonFontStyle(fontFamily.regular, 16, colors.black),
  },
});
