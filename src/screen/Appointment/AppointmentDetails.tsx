import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AppointmentDetailsLoader, BackHeader, Loader } from "../../components";
import { strings } from "../../helper/string";
import AppointmentDetailCard from "../../components/common/AppointmentDetailCard";
import { images } from "../../theme/icons";
import { hp, infoToast, wp } from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { useNavigation, useRoute } from "@react-navigation/native";
import { screenName } from "../../helper/routeNames";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import moment from "moment";
import {
  createChatRoom,
  getAppointmentDetails,
  writeReview,
} from "../../actions";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import FeedbackModal from "../../components/common/FeedbackModal";
import { getAsyncUserInfo } from "../../helper/asyncStorage";
import { APPOINTMENT_TYPE } from "../../actions/dispatchTypes";

type RowItemValueProps = {
  title: string;
  value: string;
};

const RowItemValue = ({ title, value }: RowItemValueProps) => {
  return (
    <View style={styles.rowSpaceStyle}>
      <Text style={styles.greyTitleTextStyle}>{title}</Text>
      <Text style={styles.valueTextStyle}>{value}</Text>
    </View>
  );
};

const AppointmentDetails = () => {
  const dispatch = useAppDispatch();
  const { navigate, goBack, setParams } = useNavigation();
  const { params }: any = useRoute();
  const { appointmentDetails } = useAppSelector((state) => state.appointment);
  const { profileData } = useAppSelector((state) => state.profile);
  const { Appointment } = appointmentDetails || {};
  const { isLoading } = useAppSelector((state) => state.common);
  const [loading, setLoading] = useState(false);
  const [IsModal, setIsModal] = useState(false);
  const { appointmentType } = useAppSelector((state) => state?.appointment);

  useEffect(() => {
    let obj = {
      id: params?.id,
      onSuccess: () => {},
      onFailure: () => {},
    };
    dispatch(getAppointmentDetails(obj));
  }, [params?.id]);

  console.log("appointmentType", appointmentType);

  const onPressCancel = () => {
    navigate(screenName.AppointmentCancellation);
  };

  const onPressReschedule = () => {
    navigate(screenName.AppointmentReschedule, { id: params?.id });
  };

  const onPressChat = () => {
    setLoading(true);
    let data = {
      participants: [Appointment?.expertId?._id, profileData?.user?._id],
    };
    let obj = {
      data: data,
      onSuccess: (response: any) => {
        setLoading(false);
        let roomId = response?.roomId;
        let receiver = response?.participants?.filter(
          (item: any) => item._id !== profileData?.user?._id
        )?.[0];
        //@ts-ignore
        navigate(screenName.ChatDetails, {
          roomId: roomId,
          name: receiver?.name,
          receiverId: receiver?._id,
          receiverImage: Appointment?.expertId?.user_profile_images?.[0]?.image,
          device_token: receiver?.device_token,
        });
      },
      onFailure: () => {
        setLoading(false);
      },
    };
    dispatch(createChatRoom(obj));
  };
  const onPressFeedback = () => {
    setIsModal(!IsModal);
  };
  const onPressSubmit = async (rating: number, review: string) => {
    let userInfo = await getAsyncUserInfo();
    if (review.trim().length < 0) {
      Alert.alert("Enter review");
    } else if (rating < 1) {
      Alert.alert("Enter rating");
    } else {
      setLoading(true);
      let obj = {
        data: {
          expertId: params?.expertId,
          userId: userInfo?.userId,
          star_rating: rating,
          review: review,
        },
        onSuccess: () => {
          setLoading(false);
          navigate(screenName.Feedback);
          setIsModal(!IsModal);
        },
        onFailure: (Err) => {
          setLoading(false);
          infoToast(Err?.data?.message);
          console.log(Err);
        },
      };
      dispatch(writeReview(obj));
    }
  };

  return (
    <View style={styles.conatiner}>
      <BackHeader title={strings.Appointment_Detail} />
      <Loader visible={loading} />
      <ScrollView>
        {isLoading ? (
          <AppointmentDetailsLoader />
        ) : (
          <View style={styles.card_container}>
            <AppointmentDetailCard
              lat={
                Appointment?.expertId?.addresses?.[0]?.address?.location
                  ?.coordinates?.[0]
              }
              lng={
                Appointment?.expertId?.addresses?.[0]?.address?.location
                  ?.coordinates?.[1]
              }
              imgBaseURL={appointmentDetails?.featured_image_url}
              userImg={Appointment?.expertId?.user_profile_images?.[0]?.image}
              name={Appointment?.expertId?.name}
              rating={Appointment?.expertId?.averageRating}
              jobs={Appointment?.expertId?.jobDone}
              phoneNumber={Appointment?.expertId?.phone}
              location={
                Appointment?.expertId?.addresses?.[0].address?.houseNumber +
                "," +
                Appointment?.expertId?.addresses?.[0].address?.sector +
                "," +
                Appointment?.expertId?.addresses?.[0].address?.landmark
              }
              date={moment(Appointment?.timeSlot?.[0]?.availableDate).format(
                "DD MMM,YYYY"
              )}
              time={Appointment?.timeSlot?.[0]?.availableTime}
              onPressChat={onPressChat}
              bookingID={Appointment?.bookingNumber}
            />
          </View>
        )}

        <View style={styles.otp_conatiner}>
          {isLoading ? (
            <SkeletonPlaceholder borderRadius={4}>
              <SkeletonPlaceholder.Item
                width={120}
                height={20}
                backgroundColor={colors.primary_light_blue_4}
              />
            </SkeletonPlaceholder>
          ) : (
            <View style={styles.otp_detail_container}>
              <Text style={styles.otp_title}>
                {strings["OTP to start the service"]}
              </Text>
              <Text style={styles.otp_number}>{Appointment?.otp}</Text>
            </View>
          )}
        </View>

        {isLoading ? (
          <View />
        ) : (
          <View style={{ ...styles.whiteContainer, marginTop: 0 }}>
            <Text style={styles.titleStyle}>{strings["Bill Details"]}</Text>
            {Appointment?.services?.map((item: any) => {
              return (
                <RowItemValue
                  title={item?.service_name}
                  value={`₹ ${item?.price}`}
                />
              );
            })}
            <RowItemValue
              title={`Discount of Service`}
              value={`₹ ${Appointment?.discount}`}
            />
            <RowItemValue
              title="Tax"
              value={`₹ ${Number(Appointment?.tax).toFixed(2)}`}
            />
            <RowItemValue
              title="Payment Method"
              value={Appointment?.paymentType}
            />
            <View style={styles.lineStyle} />
            <View style={styles.rowSpaceStyle}>
              <Text style={styles.valueTextStyle}>{"Total (INR)"}</Text>
              <Text
                style={styles.valueTextStyle}
              >{`₹ ${Appointment?.totalAmount}`}</Text>
            </View>
          </View>
        )}
      </ScrollView>
      <FeedbackModal
        userImg={
          appointmentDetails?.featured_image_url +
          "/" +
          Appointment?.expertId?.user_profile_images?.[0]?.image
        }
        expertInfo={Appointment?.expertId}
        close={setIsModal}
        visible={IsModal}
        onPresssubmit={(rating, review) => {
          onPressSubmit(rating, review);
        }}
      />
      {params?.status?.toLowerCase() == "upcoming" ? (
        <View style={styles.elevationStyle}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => onPressCancel()}>
            <ImageBackground
              resizeMode="stretch"
              style={styles.cartBtnStyle}
              source={images.gery_button}
            >
              <Text style={styles.goTextStyle}>{strings.Cancel}</Text>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => onPressReschedule()}
          >
            <ImageBackground
              resizeMode="stretch"
              style={styles.cartBtnStyle}
              source={images.blue_button}
            >
              <Text style={styles.goTextStyle}>{strings.Reschedule}</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      ) : params?.status?.toLowerCase() == "reschedule" ? (
        <View style={styles.elevationStyle}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => onPressCancel()}>
            <ImageBackground
              resizeMode="stretch"
              style={styles.cartBtnStyle}
              source={images.gery_button}
            >
              <Text style={styles.goTextStyle}>{strings.Cancel}</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      ) : params?.status?.toLowerCase() == "completed" &&
        appointmentDetails?.reviewGiven == "No" ? (
        <View style={styles.elevationStyle}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => onPressFeedback()}
          >
            <ImageBackground
              resizeMode="stretch"
              style={styles.cartBtnStyle}
              source={images.blue_button}
            >
              <Text style={styles.goTextStyle}>{strings.Give_Feedback}</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

export default AppointmentDetails;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
  },
  card_container: {
    marginTop: hp(25),
  },
  otp_conatiner: {
    marginVertical: hp(19),
    backgroundColor: colors.primary_light_blue_4,
    paddingVertical: hp(18),
    paddingHorizontal: wp(20),
    marginHorizontal: hp(15),
    borderRadius: wp(8),
  },
  otp_title: {
    ...commonFontStyle(fontFamily.medium, 16, colors.green_3),
  },
  otp_number: {
    ...commonFontStyle(fontFamily.medium, 20, colors.green_3),
    letterSpacing: wp(5),
  },
  otp_detail_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  whiteContainer: {
    margin: 20,
    borderRadius: 8,
    padding: wp(13),
    backgroundColor: colors.white,
    marginBottom: hp(40),
    marginHorizontal: hp(15),
  },
  titleStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black),
    marginBottom: hp(10),
  },
  lineStyle: {
    borderBottomWidth: 1,
    borderColor: colors.gery_7,
    marginVertical: hp(10),
  },
  rowSpaceStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: hp(10),
  },
  valueTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 16, colors.black),
  },
  greyTitleTextStyle: {
    ...commonFontStyle(fontFamily.regular, 16, colors.gery_6),
  },
  elevationStyle: {
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
    alignItems: "center",
    justifyContent: "space-between",
    gap: wp(10),
  },
  priceTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 24, colors.black_2),
    flex: 1,
    textAlign: "center",
  },
  cartBtnStyle: {
    height: hp(60),
    alignItems: "center",
    justifyContent: "center",
  },
  goTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black_2),
  },
});
