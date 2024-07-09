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
import { StarIcon, VerifyIcon } from "../../theme/SvgIcon";
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
import { getUserItemDetails, getUsersFavList } from "../../actions";
import { getExpertAvailability } from "../../actions/commonActions";

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
  const { itemDetails } = useAppSelector((state) => state.home);

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

  useEffect(() => {
    getAllOfferData(true);
    getDatesList();
  }, []);

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

  const onPressApplyDate = () => {};

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
        stickyHeaderIndices={[1]}
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

        <FlatList
          style={styles.filterStyle}
          data={offer_filter}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }: any) => {
            return (
              <Filter_Button
                onPress={() => onPressFilterItem(item?.id)}
                containerStyle={
                  offer_filter.length - 1 == index
                    ? { marginRight: wp(10) }
                    : null
                }
                title={item?.title}
                type={item?.isIcon == true ? "icon" : "simple"}
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
          {/* <FlatList
            style={styles.flatListStyle}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={offersOffList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  onPress={() => onPressPercetageItem(item.discount)}
                >
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
          /> */}

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
                    <View style={styles.rowStyle}>
                      <Text style={styles.nameTextStyle}>
                        {item?.expertDetails?.name}
                      </Text>
                      <View style={styles.rating_badge}>
                        <Text style={styles.rating_title}>{"3.2"}</Text>
                        <StarIcon height={8} width={8} />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
        {footerLoading && <ActivityIndicator />}
      </ScrollView>
      <SelectDateModal
        visible={isModal}
        close={setIsModal}
        dates={dates}
        onPressDateItem={(index: any) => onPressDateItem(index)}
        onPressTimeItem={(index: any) => onPressTimeItem(index)}
        setIsModal={setIsModal}
        times={times}
        selectedDateIndex={selectedDateIndex}
        selectedTimeIndex={selectedTimeIndex}
        onPressApply={onPressApplyDate}
        DateItem_style={styles.dateStyle}
        scrollEnabled={false}
        withOutDisable={false}
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
    height: hp(290),
    marginHorizontal: wp(20),
    marginBottom: hp(26),
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
    bottom: hp(-10),
    left: screen_width * 0.35,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors?.white,
    borderRadius: 5,
    paddingRight: wp(7),
    elevation: 3,
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  barberImgStyle: {
    height: wp(30),
    width: wp(30),
    borderRadius: 100,
    backgroundColor: colors.grey_19,
    position: "absolute",
    zIndex: 999,
    left: wp(-11),
    elevation: 3,
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  nameTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 14, colors.black),
    marginRight: wp(5),
    paddingVertical: hp(6),
  },
  rowStyle: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: wp(24),
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
    padding: hp(2),
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
});

export default Offers;
