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
  LayoutAnimation,
  Platform,
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
  infoToast,
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
import moment from "moment";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  addToCart,
  getAllPackageByLocation,
  getCampaignExpert,
  getMainServices,
} from "../../actions";
import FastImage from "react-native-fast-image";
import { api } from "../../helper/apiConstants";
import { getExpertAvailability } from "../../actions/commonActions";
import { getAsyncCoord, getAsyncUserInfo } from "../../helper/asyncStorage";

let offersOffList = [
  { id: 1, off: "10%", discount: 10 },
  { id: 2, off: "20%", discount: 20 },
  { id: 3, off: "30%", discount: 30 },
  { id: 4, off: "40%", discount: 40 },
  { id: 5, off: "50%", discount: 50 },
];
const Packages = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { allpackages, packageList } = useAppSelector((state) => state.package);
  const { profileData } = useAppSelector((state) => state.profile);
  const [page, setPage] = useState(1);
  const [footerLoading, setFooterLoading] = useState(false);
  const [refreshControl, setRefreshControle] = useState(false);
  const { isLoading } = useAppSelector((state) => state.common);
  const [discount, setDiscount] = useState<any>(null);
  const [serviceType, setServiceType] = useState<any>(null);
  const [services, setServices] = useState([]);
  const [expanded, setExpanded] = useState({});
  const { mainService } = useAppSelector((state) => state.home);
  const [visible, setVisible] = useState(false);
  const [selectPackages, setSelectPackages] = useState({});
  const [dates, setDates] = useState([]);
  const [times, setTimes] = useState([]);
  const [selectedDateIndex, setSelectedDate] = useState(Number);
  const [selectedTimeIndex, setSelectedTime] = useState(Number);
  const [date, setDate] = useState("");
  const [bookTime, setBookTime] = useState({});
  const [isModalLoader, setIsModalLoader] = useState(true);

  useEffect(() => {
    getPackagesData(true);
    getDatesList();
  }, []);

  async function getDatesList(expert_id?: any) {
    setIsModalLoader(true);
    let data = generateWeekDates(5);

    let obj = {
      data: {
        startDate: moment(data?.[0]?.date).format("YYYY-MM-DD"),
        endDate: moment(data?.[data?.length - 1]?.date).format("YYYY-MM-DD"),
        timeSlotDuration: 15,
        expertId: expert_id,
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

  const getPackagesData = async (isLoading: boolean) => {
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
      onSuccess: (response: any) => {
        getMainService(response?.packages);
        setPage(page + 1);
        setFooterLoading(false);
      },
      onFailure: () => {},
    };
    dispatch(getAllPackageByLocation(obj));
  };

  const getMainService = async (listData: any) => {
    let obj = {
      onSuccess: (response: any) => {
        let data = [...response?.services];
        data?.map((item, index) => {
          let offerData = listData?.flatMap((i, index) => {
            let datas = i?.service_name?.filter(
              (e, index) => e?.service_name == item?.service_name
            );
            return datas?.length ? i : [];
          });
          item.isExpand = true;
          item.subService = offerData || [];
        });
        setServices([...data]);
      },
      onFailure: (Err) => {
        console.log("Errr in Offer", Err);
      },
    };
    dispatch(getMainServices(obj));
  };

  const onPressMenu = () => {
    navigation.openDrawer();
  };

  const onPressCampaignItem = (item: any) => {
    navigation.navigate(screenName.NewYearOffer, {
      item: {
        ...item,
        bannerImg:
          allpackages?.featured_image_url + "/" + item?.campaign?.fileName,
      },
    });
  };

  const loadMoreData = () => {
    if (packageList?.length !== allpackages?.totalPackages) {
      setFooterLoading(true);
      getPackagesData(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshControle(true);
    getPackagesData(true);
    setRefreshControle(false);
  }, [refreshControl]);

  const onPressItem = (item: any) => {
    getDatesList(item?.expert_id);
    setVisible(!visible);
  };

  const onPressSearch = () => {
    navigation.navigate(screenName.SearchStylistName);
  };

  const onPressArrow = (item) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    let data = [...services];
    data.map((e, index) => {
      if (item._id === e._id) {
        item.isExpand = !item.isExpand;
      }
    });
    setServices([...data]);
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

  const onPressApply = async () => {
    let userInfo = await getAsyncUserInfo();
    let subServiceData = selectPackages?.service_name?.flatMap((items) => {
      return items?.sub_services?.flatMap((item) => {
        return {
          subServiceId: item?.sub_service_id,
          subServiceName: item?.sub_service_name,
          originalPrice: item?.price,
          discountedPrice: 0,
        };
      });
    });
    let datas = {
      actionId: selectPackages?._id,
      serviceId: selectPackages?._id,
      serviceName: selectPackages?.package_name,
      originalPrice: selectPackages?.rate,
      discountedPrice: selectPackages?.discountedPrice || 0,
      timeSlot: [
        {
          timeSlot_id: times[selectedTimeIndex]?._id,
          availableTime: times[selectedTimeIndex]?.time,
          availableDate: date,
        },
      ],
      packageDetails: selectPackages?.additional_information,
      subServices: subServiceData,
      quantity: 1,
    };
    let passData = {
      userId: userInfo?.userId,
      expertId: selectPackages?.expert_id,
      services: [],
      offers: [],
      packages: [datas],
    };
    let obj = {
      data: passData,
      onSuccess: async (response: any) => {
        infoToast("Package added successfully");
        navigation?.navigate("Cart");
      },
      onFailure: (Err: any) => {
        console.log("Errrr", Err);
      },
    };
    dispatch(addToCart(obj));
  };

  return (
    <View style={styles.container}>
      <BackHeader
        isMenu
        isSearch
        title={strings.Packages}
        onPressMenu={onPressMenu}
        onPressScreenSearch={onPressSearch}
      />
      <ScrollView
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            loadMoreData();
          }
        }}
        scrollEventThrottle={400}
        refreshControl={
          <RefreshControl refreshing={refreshControl} onRefresh={onRefresh} />
        }
      >
        {isLoading ? (
          <CarouselLoader marginTop={hp(10)} height={hp(290)} />
        ) : (
          <FastImage
            style={styles.bannerImgStyle}
            resizeMode="cover"
            source={{
              uri:
                allpackages?.featured_image_url +
                "/" +
                allpackages?.packageBanner?.fileName,
              priority: FastImage.priority.high,
            }}
          />
        )}
        <View>
          <FlatList
            data={allpackages.campaigns}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  style={styles.packageBtn}
                  onPress={() => onPressCampaignItem(item)}
                >
                  <FastImage
                    resizeMode="cover"
                    style={styles.imgStyle}
                    source={{
                      uri:
                        allpackages?.featured_image_url + "/" + item?.fileName,
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
            renderItem={({ item, index }) => {
              return (
                <>
                  <TouchableOpacity
                    onPress={() => onPressArrow(items)}
                    style={styles.headerRowStyle}
                  >
                    <Text style={styles.titleTextStyle}>
                      {item?.service_name}
                    </Text>
                    <View
                      style={{
                        transform: [
                          { rotate: item?.isExpand ? "0deg" : "180deg" },
                        ],
                      }}
                    >
                      <ArrowUp />
                    </View>
                  </TouchableOpacity>
                  {item?.isExpand ? (
                    <FlatList
                      style={{ marginTop: hp(15) }}
                      data={item.subService || []}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item, index }) => {
                        return (
                          <TouchableOpacity
                            onPress={() => onPressItem(item)}
                            style={styles.offerContainer}
                          >
                            <FastImage
                              borderTopLeftRadius={10}
                              borderTopRightRadius={10}
                              source={{
                                uri:
                                  api?.IMG_URL_2 + "/" + item?.featured_image,
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
                                        api?.IMG_URL_2 +
                                        "/" +
                                        item?.expertDetails?.user_profile_images?.filter(
                                          (images) => images?.is_featured == 1
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
                                    <StarIcon height={9} width={9} />
                                  </View>
                                </View>
                                <Text style={styles?.distanceTitle}>
                                  {`${item?.distance} km away`}
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        );
                      }}
                    />
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
    marginVertical: hp(15),
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
  packageBtn: {
    marginVertical: hp(11),
  },
  titleTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 20, colors.black),
  },
  distanceTitle: {
    ...commonFontStyle(fontFamily.semi_bold, 12, colors.black),
  },
  headerRowStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: hp(10),
    alignItems: "center",
    paddingHorizontal: wp(20),
    marginTop: hp(30),
  },
  offerFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
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
});

export default Packages;
