import React, { useCallback, useEffect, useRef, useState } from "react";
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
  LayoutAnimation,
} from "react-native";
import {
  BackHeader,
  CarouselLoader,
  Filter_Button,
  SelectDateModal,
} from "../../components";
import { strings } from "../../helper/string";
import {
  convertToOutput,
  generateWeekDates,
  hp,
  isCloseToBottom,
  screen_width,
  wp,
} from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { images } from "../../theme/icons";
import { ArrowUp, StarIcon, VerifyIcon } from "../../theme/SvgIcon";
import { offer_filter } from "../../helper/constunts";
import { screenName } from "../../helper/routeNames";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  getAllOffersByLocation,
  getCampaignExpert,
} from "../../actions/offerAction";
import moment from "moment";
import FastImage from "react-native-fast-image";
import { getAsyncUserInfo } from "../../helper/asyncStorage";
import {
  getMainServices,
  getUserItemDetails,
  getUsersFavList,
} from "../../actions";
import { getExpertAvailability } from "../../actions/commonActions";
import { err } from "react-native-svg";
import { LayoutAnimationConfig } from "react-native-reanimated";

let offersOffList = [
  { id: 1, off: "10%", discount: 10 },
  { id: 2, off: "20%", discount: 20 },
  { id: 3, off: "30%", discount: 30 },
  { id: 4, off: "40%", discount: 40 },
  { id: 5, off: "50%", discount: 50 },
];

const Offers = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { profileData } = useAppSelector((state) => state.profile);
  const { allOffers, offerList } = useAppSelector((state) => state.offers);
  const { isLoading } = useAppSelector((state) => state.common);
  const { itemDetails, mainService } = useAppSelector((state) => state.home);

  const [footerLoading, setFooterLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshControl, setRefreshControle] = useState(false);
  const [discount, setDiscount] = useState<any>(null);
  const [serviceType, setServiceType] = useState<any>(null);
  const [like, setLike] = useState(false);
  const [likeID, setLikeID] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [dates, setDates] = useState([]);
  const [times, setTimes] = useState([]);
  const [selectedDateIndex, setSelectedDate] = useState(Number);
  const [selectedTimeIndex, setSelectedTime] = useState(Number);
  const [date, setDate] = useState("");
  const [bookTime, setBookTime] = useState({});
  const [expanded, setExpanded] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    getMainService();
    getAllOfferData(true);
    getDatesList();
  }, []);

  useEffect(() => {
    if (expanded == null) {
      setExpanded(mainService[0]?.service_name);
    }
  }, [mainService]);

  useEffect(() => {
    if (offerList.length > 0) {
      getDetails();
    }
  }, [offerList]);

  useEffect(() => {
    if (Object.values(itemDetails).length > 0 || itemDetails.length) {
      getFavUser();
    }
  }, [itemDetails]);

  const getAllOfferData = (isLoading: boolean) => {
    let obj = {
      isLoading: isLoading,
      data: {
        city_id: profileData?.user?.city?.[0]?.city_id,
        limit: 10,
        page: page,
      },
      onSuccess: (res: any) => {
        setPage(page + 1);
        setFooterLoading(false);
      },
      onFailure: () => {},
    };
    dispatch(getAllOffersByLocation(obj));
  };

  const getDetails = () => {
    let userid = offerList?.[0]?.expert_id;
    let obj = {
      data: {
        userid: userid,
      },
      onSuccess: (res) => {},
      onFailure: () => {},
    };
    dispatch(getUserItemDetails(obj));
  };

  const getFavUser = async () => {
    let userInfo = await getAsyncUserInfo();
    let obj = {
      data: {
        userId: userInfo?._id,
      },
      onSuccess: (response: any) => {
        response?.data.forEach((item) => {
          if (item?._id == itemDetails?.user?._id) {
            setLikeID(item?.favouriteId);
            setLike(true);
          } else {
            setLike(false);
          }
        });
      },
      onFailure: (Errr: any) => {
        console.log("getFavUser Errr", Errr);
      },
    };
    dispatch(getUsersFavList(obj));
  };

  const onPressMenu = () => {
    navigation.openDrawer();
  };

  async function getDatesList() {
    let userInfo = await getAsyncUserInfo();
    let data = generateWeekDates(5);

    let obj = {
      data: {
        startDate: moment(data?.[0]?.date).format("YYYY-MM-DD"),
        endDate: moment(data?.[data?.length - 1]?.date).format("YYYY-MM-DD"),
        timeSlotDuration: 15,
        expertId: userInfo._id,
      },
      onSuccess: (response: any) => {
        let data = convertToOutput(response);
        setDates(data);
        let time = data?.[0]?.value;
        setDate(data[0]?.title);
        setTimes(data[0]?.value);

        let indexes = time
          ?.map((time: any, index: number) =>
            time?.isPast == false ? index : null
          )
          ?.filter((item) => item);
        setBookTime(time[indexes[0]]);
        setSelectedTime(indexes[0]);
      },
      onFailure: () => {},
    };
    dispatch(getExpertAvailability(obj));
  }

  const onPressPercetageItem = (discount: number) => {
    let obj = {
      isLoading: true,
      data: {
        city_id: profileData?.user?.city?.[0]?.city_id,
        limit: 10,
        page: 1,
        discount: discount,
        service_for: serviceType,
      },
      onSuccess: () => {
        setDiscount(discount);
        setPage(2);
        setFooterLoading(false);
      },
      onFailure: () => {},
    };
    dispatch(getAllOffersByLocation(obj));
  };

  const onPressFilterItem = (item: any) => {
    if (item == 1) {
      setIsModal(!isModal);
    }
  };

  const nearest = (item) => {
    let obj = {
      isLoading: true,
      data: {
        city_id: profileData?.user?.city?.[0]?.city_id,
        limit: 10,
        page: 1,
        discount: discount,
        service_for: item.title,
      },
      onSuccess: () => {
        setPage(2);
        setServiceType(item.title);
        setFooterLoading(false);
      },
      onFailure: () => {},
    };
    dispatch(getAllOffersByLocation(obj));
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

  const onPressOfferItem = (item: any) => {
    navigation.navigate(screenName.YourStylist, {
      id: item?.expert_id,
      like: like,
      likeID: likeID,
      itemDetails: itemDetails,
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

  const onPressSearch = () => {
    navigation.navigate(screenName.SearchStylistName);
  };

  const getMainService = async () => {
    let obj = {
      onSuccess: () => {},
      onFailure: (Err) => {
        console.log("Errr in Offer", err);
      },
    };
    dispatch(getMainServices(obj));
  };

  const onPressArrow = (item) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    setExpanded(expanded === item?.service_name ? null : item?.service_name);
  };

  return (
    <View style={styles.container}>
      <BackHeader
        isMenu
        isSearch
        title={"My Stylist Offers"}
        onPressMenu={onPressMenu}
        onPressScreenSearch={onPressSearch}
        containerStyle={styles?.containerStyle}
        titleTextStyle={{ flex: 0 }}
      />
      <ScrollView
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            loadMoreData();
          }
        }}
        ref={flatListRef}
        refreshControl={
          <RefreshControl refreshing={refreshControl} onRefresh={onRefresh} />
        }
        scrollEventThrottle={400}
      >
        {isLoading ? (
          <CarouselLoader marginTop={hp(10)} height={hp(290)} />
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
        <View>
          <FlatList
            data={mainService || []}
            renderItem={({ item }) => {
              const isExpanded = expanded === item?.service_name;
              return (
                <>
                  <TouchableOpacity
                    onPress={() => onPressArrow(item)}
                    style={styles.headerRowStyle}
                  >
                    <Text style={styles.titleTextStyle}>
                      {item?.service_name}
                    </Text>
                    <View
                      style={{
                        transform: [{ rotate: isExpanded ? "0deg" : "180deg" }],
                      }}
                    >
                      <ArrowUp />
                    </View>
                  </TouchableOpacity>
                  {isExpanded ? (
                    isLoading ? (
                      <CarouselLoader marginTop={hp(10)} height={hp(280)} />
                    ) : (
                      <>
                        <FlatList
                          data={allOffers?.campaigns}
                          renderItem={({ item, index }) => {
                            return (
                              <TouchableOpacity
                                onPress={() => onPressCampaignItem(item)}
                              >
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
                        <FlatList
                          style={{ marginTop: hp(15) }}
                          data={offerList || []}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({ item, index }) => {
                            return (
                              <TouchableOpacity
                                onPress={() => onPressOfferItem(item)}
                                style={styles.offerContainer}
                              >
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
                                  <View style={styles.offerFooter}>
                                    <View style={styles.rowStyle}>
                                      <FastImage
                                        resizeMode="cover"
                                        source={{
                                          uri:
                                            allOffers?.featured_image_url +
                                            "/" +
                                            item?.expertDetails
                                              ?.user_profile_images?.[0].image,
                                          priority: FastImage.priority.high,
                                        }}
                                        style={styles.barberImgStyle}
                                      />
                                      <Text style={styles.nameTextStyle}>
                                        {item?.expertDetails?.name}
                                      </Text>
                                      <View style={styles.rating_badge}>
                                        <Text style={styles.rating_title}>
                                          {item?.expertDetails?.rating}
                                        </Text>
                                        <StarIcon height={8} width={8} />
                                      </View>
                                    </View>
                                    <Text style={styles?.distanceTitle}>
                                      {"4 km away"}
                                    </Text>
                                  </View>
                                </View>
                              </TouchableOpacity>
                            );
                          }}
                        />
                      </>
                    )
                  ) : null}
                </>
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
    marginBottom: hp(15),
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
    width: screen_width - wp(40),
    marginTop: hp(15),
    backgroundColor: colors.grey_19,
    alignSelf: "center",
    borderRadius: wp(10),
    marginBottom: hp(20),
  },
  offerContainer: {
    height: hp(290),
    marginHorizontal: wp(20),
    marginBottom: hp(26),
    overflow: "hidden",
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
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors?.white,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    bottom: 0,
    width: "100%",
    paddingVertical: hp(6),
    paddingHorizontal: wp(8),
  },
  barberImgStyle: {
    height: wp(24),
    width: wp(24),
    borderRadius: 100,
    backgroundColor: colors.grey_19,
  },
  nameTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 14, colors.black),
  },
  rowStyle: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(6),
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
  containerStyle: {
    justifyContent: "space-between",
  },
  rating_badge: {
    backgroundColor: colors.light_green,
    borderRadius: wp(3),
    padding: hp(3),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
    gap: wp(3),
  },
  rating_title: {
    ...commonFontStyle(fontFamily.semi_bold, 10, colors.white),
  },
  dateStyle: {
    width: wp(50),
    height: hp(60),
  },
  headerRowStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: hp(10),
    alignItems: "center",
    paddingHorizontal: wp(20),
    marginTop: hp(30),
  },
  titleTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 20, colors.black),
  },
  distanceTitle: {
    ...commonFontStyle(fontFamily.semi_bold, 12, colors.black),
  },
  offerFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
});

export default Offers;
