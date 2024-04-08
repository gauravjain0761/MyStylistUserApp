import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { strings } from "../../helper/string";
import { PastServices, barbers } from "../../helper/constunts";
import BarberAppointmentCard from "../../components/common/BarberAppointmentCard";
import { hp, isCloseToBottom, wp } from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import { fontFamily, commonFontStyle } from "../../theme/fonts";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { screenName } from "../../helper/routeNames";
import { BackHeader } from "../../components";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getAsyncUserInfo } from "../../helper/asyncStorage";
import { getAppointmentDetails, getUserAppointments } from "../../actions";
import moment from "moment";
import debounce from "lodash.debounce"; // Import debounce from lodash library

const Appointments = ({ navigation }) => {
  const { navigate } = useNavigation();
  const dispatch = useAppDispatch();
  const { appointmentList, appointment } = useAppSelector(
    (state) => state.appointment
  );
  const [footerLoading, setFooterLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshControl, setRefreshControle] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setPage(1);
      getList(true);
    }, [])
  );

  async function getList(isLoading: boolean) {
    const userInfo = await getAsyncUserInfo();
    let data = {
      userId: userInfo?._id,
      page: page,
      limit: 10,
    };
    let obj = {
      isLoading: isLoading,
      data,
      onSuccess: () => {
        setPage(page + 1);
        setFooterLoading(false);
      },
      onFailure: (Err: any) => {
        console.log(Err);
      },
    };
    dispatch(getUserAppointments(obj));
  }

  const onPressItem = (item: any) => {
    let obj = {
      id: item?._id,
      onSuccess: (response) => {
        // @ts-ignore
        navigate(screenName.AppointmentDetails);
      },
      onFailure: () => {},
    };
    dispatch(getAppointmentDetails(obj));
  };

  const loadMoreData = () => {
    if (appointment?.length !== appointmentList?.totalAppointments) {
      setFooterLoading(true);
      getList(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshControle(true);
    setPage(1);
    getList(true);
    setRefreshControle(false);
  }, [refreshControl]);

  const debouncedLoadMoreData = debounce(loadMoreData, 500); // Adjust the delay as needed

  return (
    <View style={styles.container}>
      <BackHeader
        isMenu
        title={strings.Your_Appointments}
        onPressMenu={() => navigation.openDrawer()}
      />
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
        {appointment
          ?.filter((i: any) => i.appointmentType !== "past")
          .map((item, index) => {
            return (
              <View key={index} style={styles.cards}>
                <BarberAppointmentCard
                  name={item.expertDetails?.name}
                  date={moment(item?.timeSlot?.[0]?.availableDate).format(
                    "DD MMM YYYY, "
                  )}
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
                  isCompleted={false}
                  price={item.totalAmount}
                  image={item.expertDetails.user_profile_images?.[0]?.image}
                  onPress={() => onPressItem(item)}
                  imgBaseURL={appointmentList?.featured_image_url}
                />
              </View>
            );
          })}

        {appointment?.filter((i: any) => i.appointmentType === "past")?.length >
        0 ? (
          <View style={styles?.stylists_title_container}>
            <View style={styles?.title_border}></View>
            <Text style={styles?.your_stylists_title}>
              {strings?.Past_Services}
            </Text>
            <View style={styles?.title_border}></View>
          </View>
        ) : null}
        {appointment
          ?.filter((i: any) => i.appointmentType === "past")
          .map((item, index) => {
            return (
              <View key={index} style={styles.cards}>
                <BarberAppointmentCard
                  name={item.expertDetails?.name}
                  date={moment(item?.timeSlot?.[0]?.availableDate).format(
                    "DD MMM YYYY, "
                  )}
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
                  isCompleted={true}
                  price={item.totalAmount}
                  image={item.expertDetails.user_profile_images?.[0]?.image}
                  onPress={() => onPressItem(item)}
                  imgBaseURL={appointmentList?.featured_image_url}
                />
              </View>
            );
          })}

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
});

export default Appointments;
