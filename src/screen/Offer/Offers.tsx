import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ScrollView,
  RefreshControl,
  LayoutAnimation,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { BackHeader, CarouselLoader, SelectDateModal } from "../../components";
import {
  convertToOutput,
  generateWeekDates,
  hp,
  infoToast,
  isCloseToBottom,
  screen_width,
  wp,
} from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { ArrowUp, StarIcon, VerifyIcon } from "../../theme/SvgIcon";
import { screenName } from "../../helper/routeNames";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getAllOffersByLocation } from "../../actions/offerAction";
import moment from "moment";
import FastImage from "react-native-fast-image";
import { getAsyncCoord, getAsyncUserInfo } from "../../helper/asyncStorage";
import {
  addToCart,
  getCartlist,
  getMainServices,
  getUserItemDetails,
} from "../../actions";
import { getExpertAvailability } from "../../actions/commonActions";
import { CART_DETAILS } from "../../actions/dispatchTypes";

const Offers = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { profileData } = useAppSelector((state) => state.profile);
  const { allOffers, offerList } = useAppSelector((state) => state.offers);
  const { isLoading } = useAppSelector((state) => state.common);
  const { itemDetails, mainService } = useAppSelector((state) => state.home);

  const [footerLoading, setFooterLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [page, setPage] = useState(1);
  const [refreshControl, setRefreshControle] = useState(false);
  const [discount, setDiscount] = useState<any>(null);
  const [serviceType, setServiceType] = useState<any>(null);
  const [isModal, setIsModal] = useState(false);
  const [dates, setDates] = useState([]);
  const [times, setTimes] = useState([]);
  const [selectedDateIndex, setSelectedDate] = useState(Number);
  const [selectedTimeIndex, setSelectedTime] = useState(Number);
  const [date, setDate] = useState("");
  const [bookTime, setBookTime] = useState({});
  const [expanded, setExpanded] = useState({});
  const [visible, setVisible] = useState(false);
  const [selectOffer, setSelectOffer] = useState({});
  const [isModalLoader, setIsModalLoader] = useState(true);

  useEffect(() => {
    getMainService();
    getAllOfferData(true);
    getCart();
    getDatesList(null);
  }, []);

  useEffect(() => {
    setServices(mainService);
    let selectedObj = {};
    mainService?.forEach((service) => {
      Object?.assign(selectedObj, { [service?.service_name]: true });
    });
    if (Object?.values(expanded)?.length == 0 && mainService?.length) {
      setExpanded(selectedObj);
    }
  }, [mainService]);

  useEffect(() => {
    if (offerList.length > 0) {
      getDetails();
    }
  }, [offerList]);

  const getCart = async () => {
    let userInfo = await getAsyncUserInfo();
    let obj = {
      data: {
        userId: userInfo?.userId,
      },
      onSuccess: async (response: any) => {
        if (Object.values(response.data?.cart)?.length > 0) {
          dispatch({
            type: CART_DETAILS,
            payload: response?.data?.cart,
          });
        } else {
          dispatch({
            type: CART_DETAILS,
            payload: {},
          });
        }
      },
      onFailure: async (Errr: any) => {
        if (Errr?.data?.message === "Cart not found") {
          dispatch({
            type: CART_DETAILS,
            payload: {},
          });
        }
      },
    };
    dispatch(getCartlist(obj));
  };

  const getAllOfferData = async (isLoading: boolean) => {
    const response = await getAsyncCoord();

    let obj = {
      isLoading: isLoading,
      data: {
        city_id: profileData?.user?.city?.[0]?.city_id,
        limit: 10,
        page: page,
        latitude: response?.latitude,
        longitude: response?.longitude,
      },
      onSuccess: (res: any) => {
        setPage(page + 1);
        setFooterLoading(false);
      },
      onFailure: () => {},
    };
    dispatch(getAllOffersByLocation(obj));
  };

  const getDetails = async () => {
    const response = await getAsyncCoord();

    let userid = offerList?.[0]?.expert_id;
    let obj = {
      data: {
        userid: userid,
        latitude: response?.latitude,
        longitude: response?.longitude,
      },
      onSuccess: (res) => {},
      onFailure: () => {},
    };
    dispatch(getUserItemDetails(obj));
  };

  const onPressMenu = () => {
    navigation.openDrawer();
  };

  async function getDatesList(ids?: any) {
    setIsModalLoader(true);
    let data = generateWeekDates(5);

    let obj = {
      data: {
        startDate: moment(data?.[0]?.date).format("YYYY-MM-DD"),
        endDate: moment(data?.[data?.length - 1]?.date).format("YYYY-MM-DD"),
        timeSlotDuration: 15,
        expertId: ids,
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
        setIsModalLoader(false);
      },
      onFailure: () => {
        setIsModalLoader(false);
      },
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
    getDatesList(item?.expert_id);
    setVisible(!visible);
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
    setExpanded((prevExpandedItems) => ({
      ...prevExpandedItems,
      [item.service_name]: !prevExpandedItems[item.service_name],
    }));
  };
  const onPressApply = async () => {
    let userInfo = await getAsyncUserInfo();
    let DateString = `${date} ${bookTime?.time}`;
    let momentDate = moment(DateString, "YYYY-MM-DD hh:mm A").toISOString();
    let objs: any = {
      actionId: selectOffer?._id,
      serviceId: selectOffer?.service?.service_id,
      serviceName: selectOffer?.offer_name,
      originalPrice: selectOffer?.sub_services?.price,
      discountedPrice: selectOffer?.sub_services?.discounted_price || 0,
      // timeSlot: momentDate,
      quantity: 1,
      packageDetails: selectOffer?.additional_information,
      subServices: [
        {
          subServiceId: selectOffer?.sub_services?.sub_service_id,
          subServiceName: selectOffer?.sub_services?.sub_service_name,
          originalPrice: selectOffer?.sub_services?.price,
          discountedPrice: selectOffer?.sub_services?.discounted_price || 0,
        },
      ],
    };
    let passData = {
      userId: userInfo?.userId,
      expertId: selectOffer?.expert_id,
      timeSlot: [
        {
          timeSlot_id: times[selectedTimeIndex]?._id,
          availableTime: times[selectedTimeIndex]?.time,
          availableDate: date,
        },
      ],
      services: [],
      packages: [],
      offers: [objs],
    };
    let obj = {
      data: passData,
      onSuccess: async (response: any) => {
        infoToast("Offer added successfully");
        navigation?.navigate("Cart");
      },
      onFailure: (Err: any) => {
        console.log("Errrr", Err);
      },
    };
    dispatch(addToCart(obj));
  };

  const onPressDateItem = (index: any) => {
    setSelectedDate(index);
    setDate(dates[index]?.title);
    setTimes(dates[index]?.value);
    setSelectedTime(0);
  };

  const onPressTimeItem = (index: any) => {
    setSelectedTime(index);
    let bookDates = times[index];
    setBookTime(bookDates);
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
            data={allOffers?.campaigns}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  onPress={() => onPressCampaignItem(item)}
                  style={styles?.campaignsbtn}
                >
                  <FastImage
                    resizeMode="cover"
                    style={styles.imgStyle}
                    source={{
                      uri: allOffers?.featured_image_url + "/" + item?.fileName,
                      priority: FastImage.priority.high,
                    }}
                  />
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
          />
          <FlatList
            data={services}
            renderItem={({ item: items }) => {
              const isExpanded = expanded[items?.service_name];
              return (
                <>
                  <TouchableOpacity
                    onPress={() => onPressArrow(items)}
                    style={styles.headerRowStyle}
                  >
                    <Text style={styles.titleTextStyle}>
                      {items?.service_name}
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
                          style={{ marginTop: hp(15) }}
                          data={offerList || []}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({ item, index }) => {
                            return items?.service_name ==
                              item?.service?.service_name ? (
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
                                            item?.expertDetails?.user_profile_images?.filter(
                                              (images) =>
                                                images?.is_featured == 1
                                            )?.[0]?.image,
                                          priority: FastImage.priority.high,
                                        }}
                                        style={styles.barberImgStyle}
                                      />
                                      <Text style={styles.nameTextStyle}>
                                        {item?.expertDetails?.name}
                                      </Text>
                                      <View style={styles.rating_badge}>
                                        <Text style={styles.rating_title}>
                                          {item?.expertDetails?.rating || 0}
                                        </Text>
                                        <StarIcon height={8} width={8} />
                                      </View>
                                    </View>
                                    <Text style={styles?.distanceTitle}>
                                      {`${item?.distance} km away`}
                                    </Text>
                                  </View>
                                </View>
                              </TouchableOpacity>
                            ) : null;
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
      <SelectDateModal
        isModalLoader={isModalLoader}
        visible={visible}
        close={setVisible}
        dates={dates}
        onPressDateItem={(index) => onPressDateItem(index)}
        onPressTimeItem={(index) => onPressTimeItem(index)}
        setIsModal={setVisible}
        times={times}
        selectedDateIndex={selectedDateIndex}
        selectedTimeIndex={selectedTimeIndex}
        title={
          "Please select Date and Time for this Service from available slots"
        }
        withOutDisable={false}
        onPressApply={onPressApply}
        DateItem_style={styles.dateStyle}
        scrollEnabled={false}
      />
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
    backgroundColor: colors.grey_19,
    alignSelf: "center",
    borderRadius: wp(10),
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
    top: 1,
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
  campaignsbtn: {
    marginVertical: hp(11),
  },
});

export default Offers;
