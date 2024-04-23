import {
  Alert,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { BackHeader } from "../../components";
import { strings } from "../../helper/string";
import AppointmentConfirmCard from "../../components/common/AppointmentConfirmCard";
import { images } from "../../theme/icons";
import { hp, wp } from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import { fontFamily } from "../../theme/fonts";
import { commonFontStyle } from "../../theme/fonts";
import FeedbackModal from "../../components/common/FeedbackModal";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "../../helper/routeNames";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { writeReview } from "../../actions";
import { api } from "../../helper/apiConstants";
import FastImage from "react-native-fast-image";
import moment from "moment";

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

const AppointmentConfirm = () => {
  const { appointmentReschedule, appointmentDetails } = useAppSelector(
    (state) => state.appointment
  );
  const { Appointment } = appointmentDetails;
  const { userId, expertId } = Appointment;
  const [IsModal, setIsModal] = useState(false);
  const dispatch = useAppDispatch();

  const { navigate } = useNavigation();

  const onPressFeedback = () => {
    setIsModal(!IsModal);
  };
  const onPressCancel = () => {
    navigate(screenName.AppointmentCancellation);
  };

  const onPressSubmit = (rating: number, review: string) => {
    if (review.trim().length < 0) {
      Alert.alert("Enter review");
    } else if (rating < 1) {
      Alert.alert("Enter rating");
    } else {
      let obj = {
        data: {
          expertId: expertId._id,
          userId: userId._id,
          star_rating: rating,
          review: review,
        },
        onSuccess: () => {
          navigate(screenName.Feedback);
        },
        onFailure: (Err) => {
          console.log(Err);
        },
      };
      dispatch(writeReview(obj));
    }
  };

  const onPressBookagain = () => {
    navigate(screenName.Cart);
  };

  return (
    <View style={styles.container}>
      <BackHeader title={strings.Appointment_Detail} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <AppointmentConfirmCard
            name={expertId?.name}
            image={{
              uri: api.IMG_URL + expertId?.user_profile_images[0]?.image,
              priority: FastImage.priority.high,
            }}
            jobs={expertId?.jobDone}
            rating={expertId?.averageRating}
            location={
              expertId?.addresses?.[0].address?.houseNumber +
              "," +
              expertId?.addresses?.[0].address?.sector +
              "," +
              expertId?.addresses?.[0].address?.landmark
            }
            date={moment(Appointment?.timeSlot?.[0]?.availableDate).format(
              "DD MMM YYYY, "
            )}
            time={Appointment?.timeSlot?.[0]?.availableTime}
          />
        </View>

        <View style={{ ...styles.whiteContainer, marginTop: hp(19) }}>
          <Text style={styles.titleStyle}>{strings["Bill Details"]}</Text>
          <RowItemValue title="Hair Cut" value="₹200" />
          <RowItemValue title="Beard Trim" value="₹100" />
          <RowItemValue title="Hair color" value="₹500" />
          <RowItemValue title="Discount Applied" value="-₹300" />
          <RowItemValue title="Tax" value="₹50" />
          <RowItemValue title="Payment Method" value="Cash" />
          <View style={styles.lineStyle} />
          <View style={styles.rowSpaceStyle}>
            <Text style={styles.valueTextStyle}>{"Total (INR)"}</Text>
            <Text style={styles.valueTextStyle}>{"₹550.00"}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.elevationStyle}>
        <TouchableOpacity
          disabled={Appointment?.status !== "completed"}
          onPress={() => onPressFeedback()}
        >
          <ImageBackground
            resizeMode="stretch"
            style={styles.cartBtnStyle}
            source={images.gery_button}
          >
            <Text style={styles.goTextStyle}>{strings.Give_Feedback}</Text>
          </ImageBackground>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => onPressCancel()}>
          <ImageBackground
            resizeMode="stretch"
            style={styles.cartBtnStyle}
            source={images.gery_button}
          >
            <Text style={styles.goTextStyle}>{strings.Cancel}</Text>
          </ImageBackground>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={() => onPressBookagain()}>
          <ImageBackground
            resizeMode="stretch"
            style={styles.cartBtnStyle}
            source={images.blue_button}
          >
            <Text style={styles.goTextStyle}>{strings.Book_Again}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
      <FeedbackModal
        userImg={
          appointmentDetails?.featured_image_url +
          "/" +
          Appointment?.expertId?.user_profile_images?.[0]?.image
        }
        expertInfo={Appointment?.expertId}
        close={setIsModal}
        visible={IsModal}
        onPresssubmit={(rating, review) => onPressSubmit(rating, review)}
      />
    </View>
  );
};

export default AppointmentConfirm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginTop: hp(25),
  },
  whiteContainer: {
    margin: 20,
    borderRadius: 8,
    padding: wp(13),
    backgroundColor: colors.white,
    marginBottom: hp(40),
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
  },
  priceTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 24, colors.black_2),
    flex: 1,
    textAlign: "center",
  },
  cartBtnStyle: {
    height: hp(60),
    width: wp(160),
    alignItems: "center",
    justifyContent: "center",
  },
  goTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black_2),
  },
});
