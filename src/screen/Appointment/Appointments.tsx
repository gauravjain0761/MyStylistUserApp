import React, { useEffect } from "react";
import { StyleSheet, View, Text, FlatList, ScrollView } from "react-native";
import { strings } from "../../helper/string";
import { PastServices, barbers } from "../../helper/constunts";
import BarberAppointmentCard from "../../components/common/BarberAppointmentCard";
import { hp, wp } from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import { fontFamily, commonFontStyle } from "../../theme/fonts";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "../../helper/routeNames";
import { BackHeader } from "../../components";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getAsyncUserInfo } from "../../helper/asyncStorage";
import { getAppointmentDetails, getUserAppointments } from "../../actions";
import moment from "moment";

const Appointments = ({ navigation }) => {
  const { navigate } = useNavigation();
  const dispatch = useAppDispatch();
  const { appointmentList } = useAppSelector((state) => state.appointment);

  useEffect(() => {
    async function getList() {
      const userInfo = await getAsyncUserInfo();
      let data = {
        userId: userInfo?._id,
        page: 1,
        limit: 10,
      };
      let obj = {
        data,
        onSuccess: (ressponce) => {},
        onFailure: (Err) => {
          console.log(Err);
        },
      };
      dispatch(getUserAppointments(obj));
    }
    getList();
  }, []);

  const onPressItem = (item: any) => {
    let obj = {
      id: item?._id,
      onSuccess: (response) => {
        // @ts-ignore
        navigate(screenName.AppointmentDetails);
      },
      onFailure: () => {},
    };
    console.log(item?._id);
    dispatch(getAppointmentDetails(obj));
  };

  return (
    <View style={styles.container}>
      <BackHeader
        isMenu
        title={strings.Your_Appointments}
        onPressMenu={() => navigation.openDrawer()}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          data={
            appointmentList?.appointments?.filter(
              (i: any) => i.appointmentType !== "past"
            ) || []
          }
          renderItem={({ item, index }) => {
            return (
              <View style={styles.cards}>
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
                  image={
                    item.expertDetails.user_profile_images?.[0]?.image_small
                  }
                  onPress={() => onPressItem(item)}
                />
              </View>
            );
          }}
        />

        {appointmentList?.appointments?.filter(
          (i: any) => i.appointmentType === "past"
        )?.length > 0 ? (
          <View style={styles?.stylists_title_container}>
            <View style={styles?.title_border}></View>
            <Text style={styles?.your_stylists_title}>
              {strings?.Past_Services}
            </Text>
            <View style={styles?.title_border}></View>
          </View>
        ) : null}

        <View>
          <FlatList
            data={
              appointmentList?.appointments?.filter(
                (i: any) => i.appointmentType === "past"
              ) || []
            }
            renderItem={({ item, index }) => {
              return (
                <View style={styles.cards}>
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
                    image={
                      item.expertDetails.user_profile_images?.[0]?.image_small
                    }
                    onPress={() => onPressItem(item)}
                  />
                </View>
              );
            }}
          />
        </View>
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
