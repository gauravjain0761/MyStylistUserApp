import {
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { BackHeader, Loader } from "../../components";
import { strings } from "../../helper/string";
import AppointmentCancelCard from "../../components/common/AppointmentCancelCard";
import { images } from "../../theme/icons";
import { hp, infoToast, successToast, wp } from "../../helper/globalFunction";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "../../helper/routeNames";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { cancelAppointment, cancelReason, getReasonList } from "../../actions";
import moment from "moment";
import { getAsyncUserInfo } from "../../helper/asyncStorage";

const AppointmentCancellation = () => {
  const [select, SetSelect] = useState<any>(null);
  const { appointmentDetails, reasonList } = useAppSelector(
    (state) => state.appointment
  );
  const { Appointment } = appointmentDetails;
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const { navigate, goBack } = useNavigation();

  useEffect(() => {
    let obj = {
      params: {
        reason_type: "Appointments",
      },
      onSuccess: () => {},
      onFailure: () => {},
    };
    dispatch(getReasonList(obj));
  }, []);

  const onPressCancel = () => {
    if (select === null) {
      infoToast("Please select cancellation reason");
    } else {
      setLoading(true);
      let obj = {
        data: {
          appointmentId: Appointment?._id,
          status: "cancelled",
        },
        onSuccess: (respo) => {
          setCancelReason();
        },
        onFailure: (err: any) => {
          console.log(err);
          setLoading(false);
        },
      };
      dispatch(cancelAppointment(obj));
    }
  };

  const onPressNo = () => {
    navigate(screenName.Home);
  };

  const setCancelReason = async () => {
    let userInfo = await getAsyncUserInfo();
    let obj = {
      data: {
        reason_id: select,
        appointment_id: Appointment?._id,
        user_id: userInfo?.userId,
      },
      onSuccess: () => {
        setLoading(false);
        successToast("Appointment cancelled successfully");
        navigate(screenName.Home);
      },
      onFailure: (err: any) => {
        console.log(err);
        setLoading(false);
      },
    };
    dispatch(cancelReason(obj));
  };

  const onPressYes = () => {
    setLoading(true);
    let obj = {
      data: {
        appointmentId: Appointment?._id,
        status: "cancelled",
      },
      onSuccess: (resss) => {
        setLoading(false);
        navigate(screenName.Home);
      },
      onFailure: (err: any) => {
        console.log(err);
        setLoading(false);
      },
    };
    dispatch(cancelAppointment(obj));
  };

  return (
    <View style={styles.conatiner}>
      <BackHeader title={strings.Appointment_Cancellation} />
      <Loader visible={loading} />
      <ScrollView>
        <View style={styles.card}>
          <AppointmentCancelCard
            name={Appointment?.expertId?.name}
            image={
              appointmentDetails?.featured_image_url +
              "/" +
              Appointment?.expertId?.user_profile_images?.[0]?.image
            }
            date={moment(Appointment?.timeSlot?.[0]?.availableDate).format(
              "DD MMM,YYYY"
            )}
            time={Appointment?.timeSlot?.[0]?.availableTime}
            onPressNo={onPressNo}
            onPressYes={onPressCancel}
          />
        </View>

        <View style={styles.reason_conatiner}>
          <Text style={styles.title}>
            {strings["What is the reason of cancellation?"]}
          </Text>
          <FlatList
            data={reasonList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  onPress={() => SetSelect(item._id)}
                  style={styles.btn_conatiner}
                >
                  <View style={styles.radio_btn}>
                    {select == item._id && (
                      <View style={styles.radio_btn_icon}></View>
                    )}
                  </View>
                  <Text style={styles.reason_title}>{item.reason_name}</Text>
                </TouchableOpacity>
              );
            }}
            ItemSeparatorComponent={() => (
              <View style={styles.item_separator}></View>
            )}
          />
        </View>
      </ScrollView>
      <View style={styles.bottomStyle}>
        <TouchableOpacity onPress={onPressCancel}>
          <ImageBackground
            resizeMode="contain"
            style={styles.confirmImgStyle}
            source={images.book_button}
          >
            <Text style={styles.confirmTextStyle}>
              {strings["Confirm Cancellation"]}
            </Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AppointmentCancellation;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
  },
  card: {
    marginTop: hp(25),
  },
  reason_conatiner: {
    marginHorizontal: wp(20),
    marginTop: hp(28),
  },
  title: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black),
    marginBottom: hp(12),
  },
  radio_btn: {
    width: wp(12),
    height: wp(12),
    borderRadius: 50,
    borderBlockColor: colors.black,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  radio_btn_icon: {
    width: wp(6),
    height: wp(6),
    borderRadius: 50,
    backgroundColor: colors.primary_light_blue,
  },
  btn_conatiner: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(9),
    alignSelf: "flex-start",
  },
  reason_title: {
    ...commonFontStyle(fontFamily.bold, 15, colors.black),
    lineHeight: hp(26),
  },
  item_separator: {
    height: hp(6),
  },
  bottomStyle: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    backgroundColor: colors.white,
    padding: wp(20),
    flexDirection: "row",
    alignItems: "flex-start",
    paddingBottom: hp(25),
    justifyContent: "center",
    marginTop: hp(29),
  },
  confirmImgStyle: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(10),
  },
  confirmTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black),
    paddingHorizontal: wp(70),
    paddingVertical: hp(20),
  },
});
