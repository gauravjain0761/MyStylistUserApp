import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { BackHeader, CarouselLoader, Filter_Button } from "../../components";
import { strings } from "../../helper/string";
import {
  hp,
  isCloseToBottom,
  screen_width,
  wp,
} from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { images } from "../../theme/icons";
import { VerifyIcon } from "../../theme/SvgIcon";
import { offer_filter } from "../../helper/constunts";
import { screenName } from "../../helper/routeNames";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  getAllOffersByLocation,
  getCampaignExpert,
} from "../../actions/offerAction";
import moment from "moment";
import FastImage from "react-native-fast-image";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

let offersOffList = [
  { id: 1, off: "10%" },
  { id: 2, off: "20%" },
  { id: 3, off: "30%" },
  { id: 4, off: "40%" },
  { id: 5, off: "50%" },
];

const Offers = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { profileData } = useAppSelector((state) => state.profile);
  const { allOffers, offerList } = useAppSelector((state) => state.offers);
  const { isLoading } = useAppSelector((state) => state.common);

  const [footerLoading, setFooterLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshControl, setRefreshControle] = useState(false);

  useEffect(() => {
    getAllOfferData(true);
  }, []);

  const getAllOfferData = (isLoading: boolean) => {
    let obj = {
      isLoading: isLoading,
      data: {
        city_id: profileData?.user?.city?.[0]?.city_id,
        limit: 10,
        page: page,
      },
      onSuccess: () => {
        setPage(page + 1);
        setFooterLoading(false);
      },
      onFailure: () => {},
    };
    dispatch(getAllOffersByLocation(obj));
  };

  const onPressMenu = () => {
    navigation.openDrawer();
  };

  const onPressCampaignItem = (item: any) => {
    navigation.navigate(screenName.NewYearOffer, {
      item: {
        ...item,
        bannerImg:
          allOffers?.featured_image_url + "/" + item?.campaign?.fileName,
      },
    });
  };

  const loadMoreData = () => {
    if (offerList?.length !== allOffers?.totalOffers) {
      setFooterLoading(true);
      getAllOfferData(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshControle(true);
    getAllOfferData(true);
    setRefreshControle(false);
  }, [refreshControl]);

  return (
    <View style={styles.container}>
      <BackHeader
        isMenu
        isSearch
        title={strings.Offers}
        onPressMenu={onPressMenu}
      />
      <ScrollView
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            loadMoreData();
          }
        }}
        refreshControl={
          <RefreshControl refreshing={refreshControl} onRefresh={onRefresh} />
        }
        scrollEventThrottle={400}
        stickyHeaderIndices={[1]}
      >
        {isLoading ? (
          <CarouselLoader marginTop={hp(10)} height={hp(280)} />
        ) : (
          <FastImage
            style={styles.bannerImgStyle}
            resizeMode="cover"
            source={{
              uri:
                allOffers?.featured_image_url +
                "/" +
                allOffers?.offerBanner?.fileName,
              priority: FastImage.priority.high,
            }}
          />
        )}

        <FlatList
          style={styles.filterStyle}
          data={offer_filter}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }: any) => {
            return (
              <Filter_Button
                type={"simple"}
                onPress={() => {}}
                containerStyle={
                  offer_filter.length - 1 == index
                    ? { marginRight: wp(10) }
                    : null
                }
                title={item?.title}
                btn_bg={{ paddingHorizontal: wp(17) }}
              />
            );
          }}
          ItemSeparatorComponent={() => (
            <View style={styles.filter_item_separator}></View>
          )}
        />
        {/* </View> */}
        <View>
          <FlatList
            style={styles.flatListStyle}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={offersOffList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity>
                  <ImageBackground
                    borderRadius={10}
                    resizeMode="cover"
                    style={styles.offersContainer}
                    source={images.offers_view}
                  >
                    <Text style={styles.smallTextStyle}>{"Minimum"}</Text>
                    <Text style={styles.boldTextStyle}>
                      {item?.off}
                      {" Off"}
                    </Text>
                  </ImageBackground>
                </TouchableOpacity>
              );
            }}
          />

          {isLoading ? (
            <CarouselLoader marginTop={hp(10)} height={hp(280)} />
          ) : (
            <FlatList
              data={allOffers.campaigns}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity onPress={() => onPressCampaignItem(item)}>
                    <FastImage
                      resizeMode="cover"
                      style={styles.imgStyle}
                      source={{
                        uri:
                          allOffers?.featured_image_url +
                          "/" +
                          item?.campaign.fileName,
                        priority: FastImage.priority.high,
                      }}
                    />
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
            />
          )}

          <FlatList
            data={offerList || []}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity style={styles.offerContainer}>
                  <FastImage
                    borderTopLeftRadius={10}
                    borderTopRightRadius={10}
                    source={{
                      uri:
                        allOffers?.featured_image_url +
                        "/" +
                        item?.featured_image,
                      priority: FastImage.priority.high,
                    }}
                    style={styles.manImgStyle}
                  />
                  <View style={styles.infoContainer}>
                    <FastImage
                      resizeMode="cover"
                      source={{
                        uri:
                          allOffers?.featured_image_url +
                          "/" +
                          item?.expertDetails?.user_profile_images?.[0].image,
                        priority: FastImage.priority.high,
                      }}
                      style={styles.barberImgStyle}
                    />
                    <View style={{ marginLeft: wp(10), flex: 1 }}>
                      <View style={styles.rowStyle}>
                        <Text style={styles.nameTextStyle}>
                          {item?.expertDetails?.name}
                        </Text>
                        <VerifyIcon width={15} height={15} />
                      </View>
                      <Text style={styles.addressTextStyle}>
                        {item?.city[0]?.city_name},
                        {item?.district[0]?.district_name},{" "}
                        {item?.state[0]?.state_name}
                      </Text>
                    </View>
                    <Text style={styles.dateTextStyle}>
                      Offer Till:{" "}
                      {moment(item?.end_date).format("DD MMM, YYYY")}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
        {footerLoading && <ActivityIndicator />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background_grey,
  },
  bannerImgStyle: {
    width: screen_width,
    height: hp(280),
    borderRadius: 15,
    marginVertical: hp(15),
    marginTop: hp(10),
  },
  offersContainer: {
    height: hp(83),
    width: wp(220),
    borderRadius: 5,
    marginLeft: wp(10),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary_light_blue_2,
  },
  flatListStyle: {
    paddingLeft: wp(10),
  },
  smallTextStyle: {
    ...commonFontStyle(fontFamily.regular, 12, colors.black),
  },
  boldTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 20, colors.black),
  },
  imgStyle: {
    height: hp(290),
    width: screen_width - wp(30),
    marginTop: hp(15),
    backgroundColor: colors.grey_19,
    alignSelf: "center",
    borderRadius: wp(10),
    marginBottom: hp(20),
  },
  offerContainer: {
    height: hp(366),
    marginHorizontal: wp(20),
    marginBottom: hp(15),
  },
  manImgStyle: {
    height: hp(290),
    borderRadius: 10,
  },
  womaImgStyle: {
    height: hp(290),
    borderRadius: 10,
  },
  infoContainer: {
    borderWidth: 1,
    padding: wp(13),
    borderColor: colors.gery_7,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  barberImgStyle: {
    height: wp(48),
    width: wp(48),
    borderRadius: 10,
    backgroundColor: colors.grey_19,
  },
  nameTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 14, colors.black),
    marginRight: wp(5),
  },
  rowStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  addressTextStyle: {
    ...commonFontStyle(fontFamily.regular, 12, colors.gery_9),
  },
  dateTextStyle: {
    ...commonFontStyle(fontFamily.regular, 11, colors.gery_9),
  },
  filter_item_separator: {
    width: wp(7),
  },
  filterStyle: {
    paddingLeft: wp(20),
    paddingVertical: hp(10),
    backgroundColor: colors.background_grey,
  },
});

export default Offers;
