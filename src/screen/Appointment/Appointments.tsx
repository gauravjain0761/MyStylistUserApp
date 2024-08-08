import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { strings } from "../../helper/string";
import {
  PastServices,
  appointmentFilter,
  barbers,
  notificationFilter,
} from "../../helper/constunts";
import BarberAppointmentCard from "../../components/common/BarberAppointmentCard";
import { hp, isCloseToBottom, wp } from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import { fontFamily, commonFontStyle } from "../../theme/fonts";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { screenName } from "../../helper/routeNames";
import {
  AppointmentLoader,
  BackHeader,
  Loader,
  OvalShapView,
} from "../../components";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getAsyncUserInfo } from "../../helper/asyncStorage";
import {
  getAppointmentDetails,
  getUserAppointments,
  writeReview,
} from "../../actions";
import moment from "moment";
import debounce from "lodash.debounce"; // Import debounce from lodash library
import FeedbackModal from "../../components/common/FeedbackModal";
import { setIsLoading } from "../../actions/commonActions";

const Appointments = ({ navigation }) => {
  const { navigate } = useNavigation();
  const dispatch = useAppDispatch();

  const { appointmentList, appointment } = useAppSelector(
    (state) => state.appointment
  );
  const [footerLoading, setFooterLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshControl, setRefreshControle] = useState(false);
  const { isLoading } = useAppSelector((state) => state.common);

  const [IsModal, setIsModal] = useState(false);
  const [appointmentItem, setAppointmentItem] = useState<any>({});
  const [selectIndex, setSelectIndex] = useState("Upcoming");
  const [loading, setLoading] = useState(false);
  const { params } = useRoute();

  useFocusEffect(
    useCallback(() => {
      getList(true, params?.type, 1);
    }, [])
  );

  async function getList(isLoading: boolean, type?: any, pages?: number) {
    setLoading(isLoading);
    const userInfo = await getAsyncUserInfo();
    let data = {
      userId: userInfo?.userId,
      page: pages ? pages : page,
      limit: 10,
      status: type ? type?.toLowerCase() : selectIndex?.toLowerCase(),
    };
    let obj = {
      isLoading: isLoading,
      data,
      onSuccess: (res: any) => {
        console.log("Appoiititit", data);
        setPage(page + 1);
        setFooterLoading(false);
        setLoading(false);
      },
      onFailure: (Err: any) => {
        console.log(Err);
        setLoading(false);
      },
    };
    dispatch(getUserAppointments(obj));
  }

  const onPressItem = (item: any) => {
    //@ts-ignore
    navigate(screenName.AppointmentDetails, {
      id: item?._id,
      status: selectIndex,
      expertId: item?.expertDetails?._id,
    });
  };

  const loadMoreData = () => {
    if (appointment?.length > 5) {
      setFooterLoading(true);
      getList(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setPage(1);
    setRefreshControle(true);
    getList(true);
    setRefreshControle(false);
  }, [refreshControl]);

  const debouncedLoadMoreData = debounce(loadMoreData, 500); // Adjust the delay as needed

  useEffect(() => {
    getList(true);
  }, [selectIndex]);

  const onPressFilter = (e: string) => {
    setPage(1);
    setSelectIndex(e);
  };

  return (
    <View style={styles.container}>
      <BackHeader
        isMenu
        title={strings.Your_Appointments}
        onPressMenu={() => navigation.openDrawer()}
      />
      <View style={styles.filtercontainer}>
        <FlatList
          style={styles.horizontalListStyle}
          horizontal
          data={appointmentFilter}
          showsHorizontalScrollIndicator={false}
          ListFooterComponent={<View style={{ width: wp(20) }}></View>}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <OvalShapView
                data={item}
                index={index}
                selectIndex={selectIndex}
                onPress={(e) => onPressFilter(e)}
              />
            );
          }}
        />
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            debouncedLoadMoreData();
          }
        }}
        scrollEventThrottle={400}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshControl} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <Loader visible={loading} />
        ) : (
          <>
            {appointment?.length ? (
              <>
                {appointment
                  ?.filter((i: any) => i?.status == selectIndex.toLowerCase())
                  .map((item, index) => {
                    return (
                      <View key={index} style={styles.cards}>
                        <BarberAppointmentCard
                          name={item.expertDetails?.name}
                          date={moment(
                            item?.timeSlot?.[0]?.availableDate
                          ).format("DD MMM YYYY, ")}
                          time={item?.timeSlot?.[0]?.availableTime}
                          location={
                            item.expertDetails?.city?.[0]?.city_name +
                            ", " +
                            item.expertDetails?.district?.[0]?.district_name +
                            ", " +
                            item.expertDetails?.state?.[0]?.state_name
                          }
                          service={item?.services
                            ?.map((i: any) => i.service_name)
                            .join(", ")}
                          type={item.appointmentType}
                          rating={item?.expertDetails?.averageRating}
                          status={item?.status}
                          price={item?.totalAmount}
                          image={
                            item.expertDetails.user_profile_images?.[0]?.image
                          }
                          onPress={() => onPressItem(item)}
                          imgBaseURL={appointmentList?.featured_image_url}
                        />
                      </View>
                    );
                  })}
              </>
            ) : (
              <View style={styles.centerContainer}>
                <Text style={styles.noTextStyle}>{"No Data Found"}</Text>
              </View>
            )}
          </>
        )}

        {footerLoading && <ActivityIndicator />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appointment_card: {
    marginTop: hp(25),
  },
  title_border: {
    width: "100%",
    borderBottomWidth: hp(1),
    borderColor: colors?.stylists_border_color,
    marginHorizontal: wp(10),
    alignSelf: "center",
    backgroundColor: "yellow",
  },
  stylists_title_container: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    justifyContent: "center",
    marginBottom: hp(20),
    marginHorizontal: wp(20),
    overflow: "hidden",
    marginTop: hp(31),
  },
  your_stylists_title: {
    ...commonFontStyle(fontFamily.regular, 17, colors?.stylists_title_gray),
    paddingHorizontal: wp(16),
  },
  cards: {
    marginVertical: hp(11),
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noTextStyle: {
    ...commonFontStyle(fontFamily.medium, 14, colors?.black),
  },
  horizontalListStyle: {
    paddingBottom: hp(20),
    paddingVertical: hp(10),
    backgroundColor: colors.white,
  },
  rowSpaceStyle: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(20),
    marginVertical: hp(10),
    marginTop: hp(15),
    justifyContent: "space-between",
  },
  flexStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationTextStyle: {
    marginHorizontal: wp(4),
    ...commonFontStyle(fontFamily.regular, 15, colors.gery_6),
  },
  filtercontainer: {
    paddingHorizontal: wp(20),
    backgroundColor: colors?.white,
  },
});

export default Appointments;
