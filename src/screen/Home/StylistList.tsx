import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { screenName } from "../../helper/routeNames";
import Animated from "react-native-reanimated";
import { hp, wp } from "../../helper/globalFunction";
import { BackHeader, UserItemLoader } from "../../components";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { colors } from "../../theme/color";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { CarIcon, StarIcon, VerifyIcon } from "../../theme/SvgIcon";
import { strings } from "../../helper/string";
import { getUsersByLocation } from "../../actions";
import { requestLocationPermission } from "../../helper/locationHandler";

const StylistList = ({ navigation }) => {
  const dispatch = useAppDispatch();

  const { userList, barberList } = useAppSelector((state) => state.home);
  const [footerLoading, setFooterLoading] = useState(false);
  const [refreshControl, setRefreshControle] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState({});
  const [rating, setRating] = useState(null);

  const onPressItem = (index: number) => {
    let imgUrl =
      userList?.featured_image_url +
      "/" +
      barberList[index]?.user_profile_images?.[0]?.image;
    navigation.navigate(screenName.StylistDetails, {
      index: index,
      img: imgUrl,
      id: barberList[index]._id,
    });
  };

  useEffect(() => {
    setLoading(true);
    getUserList(true);
  }, []);

  const getUserList = async (isLoading: boolean) => {
    await requestLocationPermission(
      async (response) => {
        let data = {
          latitude: response?.latitude,
          longitude: response?.longitude,
          maxDistance: 50000,
          page: page,
          limit: 20,
          rating: rating,
          gender: null,
        };
        let obj = {
          isLoading: isLoading,
          data: data,
          onSuccess: () => {
            setFilterData(data);
            setPage(page + 1);
            setFooterLoading(false);
            setLoading(false);
          },
          onFailure: () => {
            setLoading(false);
          },
        };
        dispatch(getUsersByLocation(obj));
      },
      (err) => {
        console.log("Home Location API", err);
      }
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <BackHeader title="Stylist" />
      {loading ? (
        <View style={{ flex: 1, marginHorizontal: wp(20), marginTop: hp(20) }}>
          <FlatList
            data={[1, 2, 3, 4]}
            renderItem={({ item, index }) => {
              return <UserItemLoader key={index} />;
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      ) : (
        <FlatList
          style={styles.listContainer}
          data={barberList}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                style={styles.container}
                key={index}
                onPress={() => onPressItem(index)}
              >
                <Animated.Image
                  source={{
                    uri:
                      userList?.featured_image_url +
                      "/" +
                      item?.user_profile_images?.[0]?.image,
                  }}
                  style={styles.imgStyle}
                  sharedTransitionTag={`sharedTag-${index}`}
                />

                <View style={styles.rightContainer}>
                  <View style={styles.rowStyle}>
                    <Text numberOfLines={1} style={styles.barber_name}>
                      {item.name}
                    </Text>
                    <VerifyIcon width={14} height={14} />
                  </View>
                  <View style={styles.marginStyle} />
                  <View style={styles.rowStyle}>
                    <TouchableOpacity style={styles.rating_badge}>
                      <Text style={styles.rating_title}>
                        {item.averageRating}
                      </Text>
                      <StarIcon />
                    </TouchableOpacity>
                    <View style={styles.seprator}></View>
                    <Text style={styles.jobs_title}>
                      {item?.jobDone} {strings.Jobs_Done}
                    </Text>
                  </View>
                  <View style={styles.marginStyle} />
                  <View style={styles.rowStyle}>
                    <CarIcon />
                    <Text style={styles.location_title}>
                      {item?.offers?.[0]?.city?.[0]?.city_name}
                      {","}
                      {item?.offers?.[0]?.district?.[0]?.district_name}
                      {","}
                      {item?.offers?.[0]?.state?.[0]?.state_name}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ItemSeparatorComponent={() => (
            <View style={styles.card_separator}></View>
          )}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingBottom: hp(25),
    alignItems: "center",
    flexDirection: "row",
    borderBottomWidth: wp(1),
    marginHorizontal: wp(20),
    borderBottomColor: colors.active_dot,
  },
  card_separator: {
    height: hp(24),
  },
  imgStyle: {
    height: hp(157),
    width: wp(132),
    borderRadius: 20,
  },
  rightContainer: {
    flex: 1,
    marginLeft: wp(20),
  },
  barber_name: {
    ...commonFontStyle(fontFamily.bold, 23, colors.black),
    maxWidth: wp(170),
  },
  rowStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating_badge: {
    backgroundColor: colors.light_green,
    borderRadius: wp(6),
    padding: hp(3),
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
    gap: wp(3),
  },
  rating_title: {
    ...commonFontStyle(fontFamily.semi_bold, 12, colors.white),
  },
  seprator: {
    width: wp(4),
    height: wp(4),
    borderRadius: wp(50),
    marginHorizontal: wp(7),
    backgroundColor: colors.dark_grey,
  },
  jobs_title: {
    ...commonFontStyle(fontFamily.medium, 14, colors.dark_grey),
  },
  location_title: {
    ...commonFontStyle(fontFamily.medium, 12, colors.dark_grey),
    marginLeft: wp(5),
  },
  marginStyle: {
    height: hp(10),
  },
  listContainer: {
    marginTop: hp(20),
  },
});

export default StylistList;
