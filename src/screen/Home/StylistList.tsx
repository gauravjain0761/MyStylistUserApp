import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { screenName } from "../../helper/routeNames";
import Animated from "react-native-reanimated";
import {
  convertToOutput,
  generateWeekDates,
  hp,
  wp,
} from "../../helper/globalFunction";
import {
  BackHeader,
  Filter_Button,
  Modals,
  ReviewModal,
  SelectDateModal,
  UserItemLoader,
} from "../../components";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { colors } from "../../theme/color";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { CarIcon, StarIcon, VerifyIcon } from "../../theme/SvgIcon";
import { strings } from "../../helper/string";
import {
  getAllExpertReview,
  getUserItemDetails,
  getUsersByLocation,
  getUsersFavList,
  setLocation,
} from "../../actions";
import { requestLocationPermission } from "../../helper/locationHandler";
import { ReviewFilter, stylists_filter } from "../../helper/constunts";
import moment from "moment";
import { getAsyncUserInfo } from "../../helper/asyncStorage";
import { getExpertAvailability } from "../../actions/commonActions";

const StylistList = ({ navigation }) => {
  const dispatch = useAppDispatch();

  const { userList, barberList } = useAppSelector((state) => state.home);
  const [footerLoading, setFooterLoading] = useState(false);
  const [onEndReachedCalled, setOnEndReachedCalled] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState({});
  const [rating, setRating] = useState(null);
  const [filter, setFilter] = useState(stylists_filter);
  const [isModal, setIsModal] = useState(false);
  const [costmodal, setCostmodal] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [ratingItem, setRatingItem] = useState<any>({});
  const [dates, setDates] = useState([]);
  const [times, setTimes] = useState([]);
  const [selectedDateIndex, setSelectedDate] = useState(null);
  const [selectedTimeIndex, setSelectedTime] = useState(null);
  const [date, setDate] = useState("");
  const [bookTime, setBookTime] = useState({});
  const [like, setLike] = useState(false);
  const [likeID, setLikeID] = useState("");
  const { itemDetails } = useAppSelector((state) => state.home);

  const onPressItem = (item: number) => {
    getDetails(item);
  };

  async function getDatesList() {
    let userInfo = await getAsyncUserInfo();
    let data = generateWeekDates(5);

    let obj = {
      data: {
        startDate: moment(data?.[0].date).format("YYYY-MM-DD"),
        endDate: moment(data?.[data?.length - 1].date).format("YYYY-MM-DD"),
        timeSlotDuration: 60,
        expertId: userInfo?.userId,
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

  useEffect(() => {
    setLoading(true);
    getUserList(true);
    getFavUser();
    getDatesList();
  }, []);

  const getDetails = (item: any) => {
    let userid = item?._id;
    let obj = {
      data: {
        userid: userid,
      },
      onSuccess: (res) => {
        navigation.navigate(screenName.YourStylist, {
          id: item?._id,
          like: like,
          likeID: likeID,
          itemDetails: itemDetails,
        });
      },
      onFailure: () => {},
    };
    dispatch(getUserItemDetails(obj));
  };

  const getFavUser = async () => {
    let userInfo = await getAsyncUserInfo();
    let obj = {
      data: {
        userId: userInfo?.userId,
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

  const getUserList = async (isLoading: boolean) => {
    await requestLocationPermission(
      async (response) => {
        let data = {
          latitude: response?.latitude,
          longitude: response?.longitude,
          maxDistance: 50000,
          page: page,
          limit: 15,
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
            setOnEndReachedCalled(true);
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

  const onPressClose = (id: any) => {
    if (id == 1) {
      dateClear(true);
    } else if (id == 2) {
    } else if (id == 3) {
      // setCostmodal(!costmodal);
    } else if (id == 4) {
      ratingClear(true);
      setRating(null);
    } else if (id == 5) {
      clearBestService();
    }
    clearFilter(id);
  };

  const ModalHendler = (item: any) => {
    if (item == 1) {
      setIsModal(!isModal);
    } else if (item == 2) {
    } else if (item == 3) {
      setCostmodal(!costmodal);
    } else if (item == 4) {
      setRating(5);
      onPressRating(true, 5);
    } else if (item == 5) {
      onPressBestService();
    }
    updateFilter(item);
  };

  const updateFilter = (index: number) => {
    let data = [...filter];
    data[index - 1].isSelected = true;
    setFilter([...data]);
  };

  const clearFilter = (index: number) => {
    let data = [...filter];
    data[index - 1].isSelected = false;
    setFilter([...data]);
  };

  const onPressRating = (isLoading: boolean, rating: number) => {
    setLoading(true);
    let data = {
      ...filterData,
      rating: rating,
      page: 1,
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
  };

  const onPressBestService = () => {
    setLoading(true);
    let data = {
      ...filterData,
      best_service: "Yes",
      page: 1,
    };
    let obj = {
      isLoading: loading,
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
  };

  const dateClear = (isLoading: boolean) => {
    setLoading(true);
    let data = {
      ...filterData,
      page: 1,
      dateTime: null,
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
  };

  const ratingClear = (isLoading: boolean) => {
    setLoading(true);
    let data = {
      ...filterData,
      page: 1,
      rating: null,
    };
    let obj = {
      isLoading: isLoading,
      data: data,
      onSuccess: () => {
        setFilterData(data);
        setPage(page + 1);
        setFooterLoading(false);
        setLoading(false);
        setRating(null);
      },
      onFailure: () => {
        setLoading(false);
      },
    };
    dispatch(getUsersByLocation(obj));
  };

  const clearBestService = () => {
    setLoading(true);
    let data = {
      ...filterData,
      best_service: null,
      page: 1,
    };
    let obj = {
      isLoading: loading,
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
  };
  const onPressReviewItem = (item: any) => {
    setReviewModal(true);
    setRatingItem({
      averageRating: item?.averageRating,
      jobDone: item?.jobDone,
      _id: item?._id,
    });
    let obj = {
      user_id: item?._id,
      params: {
        limit: 100,
        page: 1,
        sort: "newest",
      },
      onSuccess: () => {},
      onFailure: () => {},
    };
    dispatch(getAllExpertReview(obj));
  };

  const onPressRatingFilterItem = (index: number) => {
    let obj = {
      user_id: ratingItem?._id,
      params: {
        limit: 100,
        page: 1,
        sort: ReviewFilter?.[index].type,
      },
      onSuccess: () => {},
      onFailure: () => {},
    };
    dispatch(getAllExpertReview(obj));
  };

  const onPressDateItem = (index: any) => {
    setSelectedDate(index);
    setDate(moment(dates[index].title));
    setTimes(dates[index].value);
    setSelectedTime(null);
  };

  const onPressTimeItem = (index: any) => {
    setSelectedTime(index);
    let bookDates = times[index];
    setBookTime(bookDates);
  };

  const onPressApplyDate = () => {
    setLocation(true);
    let data = {
      ...filterData,
      page: 1,
      dateTime: {
        timeSlot_id: bookTime?._id,
        availableDate: date,
      },
    };
    let obj = {
      isLoading: loading,
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
  };

  const loadMoreData = () => {
    if (!onEndReachedCalled && !footerLoading) {
      setFooterLoading(true);
      getUserList(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <BackHeader title="Your Stylist" />
      <View style={styles.filterStyle}>
        <FlatList
          data={filter}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }: any) => {
            return (
              <Filter_Button
                isSeleted={item.isSelected}
                onPressClose={() => onPressClose(item.id)}
                isCloseIcon={item.isSelected}
                onPress={() => {
                  ModalHendler(item.id);
                }}
                containerStyle={
                  filter.length - 1 == index ? { marginRight: wp(10) } : null
                }
                title={item?.title}
                type={item?.isIcon == true ? "icon" : "simple"}
              />
            );
          }}
          ItemSeparatorComponent={() => (
            <View style={styles?.filter_item_separator}></View>
          )}
        />
      </View>
      {loading ? (
        <View style={{ flex: 1, marginHorizontal: wp(20), marginTop: hp(20) }}>
          <FlatList
            data={[1, 2, 3, 4, 5, 6, 7]}
            renderItem={({ item, index }) => {
              return <UserItemLoader key={index} />;
            }}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
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
                onPress={() => onPressItem(item)}
              >
                <Animated.Image
                  source={{
                    uri:
                      userList?.featured_image_url +
                      "/" +
                      item?.user_profile_images?.filter(
                        (images) => images?.is_featured == 1
                      )?.[0]?.image,
                  }}
                  style={styles.imgStyle}
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
                    <TouchableOpacity
                      onPress={() => onPressReviewItem(item)}
                      style={styles.rating_badge}
                    >
                      <Text style={styles.rating_title}>
                        {item.averageRating}
                      </Text>
                      <StarIcon />
                    </TouchableOpacity>
                    <View style={styles.seprator}></View>
                    <Text style={styles.jobs_title}>
                      {item?.jobDone > 0 ? item?.jobDone : null}{" "}
                      {item?.jobDone > 0 ? strings.Jobs_Done : "New Stylist"}
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
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.7}
          onMomentumScrollBegin={() => setOnEndReachedCalled(false)}
          ListFooterComponent={() => {
            if (footerLoading) {
              return (
                <ActivityIndicator
                  color={colors.stylists_title_gray}
                  size={"large"}
                />
              );
            } else {
              return null;
            }
          }}
        />
      )}
      <Modals
        isIcon
        visible={reviewModal}
        close={setReviewModal}
        contain={
          <ReviewModal
            ratingItem={ratingItem}
            onPressFilterItem={onPressRatingFilterItem}
          />
        }
        containStyle={{ maxHeight: "80%" }}
      />
      <SelectDateModal
        visible={isModal}
        close={setIsModal}
        dates={dates}
        onPressDateItem={onPressDateItem}
        onPressTimeItem={onPressTimeItem}
        setIsModal={setIsModal}
        times={times}
        selectedDateIndex={selectedDateIndex}
        selectedTimeIndex={selectedTimeIndex}
        withOutDisable={false}
        DateItem_style={styles.dateStyle}
        onPressApply={onPressApplyDate}
      />
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
  filter_item_separator: {
    width: wp(7),
  },
  filterStyle: {
    paddingLeft: wp(16),
    paddingTop: hp(16),
  },
  dateStyle: {
    width: wp(50),
    height: hp(60),
  },
});

export default StylistList;
