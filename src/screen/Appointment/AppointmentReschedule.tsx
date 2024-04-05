import {
  BackHandler,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import AppointmentDetailCard from "../../components/common/AppointmentDetailCard";
import {
  convertToOutput,
  generateTimes,
  generateWeekDates,
  hp,
  wp,
} from "../../helper/globalFunction";
import { strings } from "../../helper/string";
import { images } from "../../theme/icons";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { BackHeader, TimeSelector, WeekDateSelector } from "../../components";
import { screenName } from "../../helper/routeNames";
import { colors } from "../../theme/color";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import moment from "moment";
import { getExpertAvailability } from "../../actions/commonActions";
import { getAsyncUserInfo } from "../../helper/asyncStorage";
import { rescheduleAppointment } from "../../actions";

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

const AppointmentReschedule = () => {
  const [dates, setDates] = useState([]);
  const [times, setTimes] = useState([]);
  const [selectedDateIndex, setSelectedDate] = useState(null);
  const [selectedTimeIndex, setSelectedTime] = useState(null);
  const [bookTime, setBookTime] = useState({});
  const [date, setDate] = useState("");
  const { appointmentDetails } = useAppSelector((state) => state.appointment);
  const { Appointment } = appointmentDetails;
  const { userId, expertId } = Appointment;
  const { navigate } = useNavigation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function getDatesList() {
      let userInfo = await getAsyncUserInfo();
      let data = generateWeekDates();

      let obj = {
        data: {
          startDate: moment(data?.[0].date).format("YYYY-MM-DD"),
          endDate: moment(data?.[data?.length - 1].date).format("YYYY-MM-DD"),
          timeSlotDuration: 1,
          expertId: userInfo._id,
        },
        onSuccess: (response: any) => {
          setDates(convertToOutput(response));
        },
        onFailure: () => {},
      };
      dispatch(getExpertAvailability(obj));
    }
    getDatesList();
  }, []);

  const onPressDateItem = (index: any) => {
    setSelectedDate(index);
    setDate(dates[index].title);
    setTimes(dates[index].value);
    setSelectedTime(null);
  };

  const onPressTimeItem = (index: any) => {
    setSelectedTime(index);
    let bookDates = times[index];
    setBookTime(bookDates);
  };

  const onPressBook = () => {
    let obj = {
      data: {
        appointmentId: Appointment?._id,
        newTimeSlot: {
          timeSlot_id: bookTime?._id,
          availableDate: date,
          availableTime: bookTime?.time,
        },
      },
      onSuccess: (response: any) => {
        navigate(screenName.AppointmentConfirm);
        console.log(response);
      },
      onFailure: () => {},
    };
    dispatch(rescheduleAppointment(obj));
  };

  const initialValue = 0;
  let price = Appointment?.services.reduce(
    (accumulator, currentValue) => currentValue.price + accumulator,
    initialValue
  );

  return (
    <View style={styles.conatiner}>
      <BackHeader title={strings.Appointment_Detail} />
      <ScrollView>
        <View style={styles.card}>
          <AppointmentDetailCard
            images={images.barber5}
            name={expertId?.name}
            rating={expertId?.averageRating}
            jobs={expertId?.jobDone}
            location={
              expertId?.addresses?.[0].address?.houseNumber +
              "," +
              expertId?.addresses?.[0].address?.sector +
              "," +
              expertId?.addresses?.[0].address?.landmark
            }
            date={moment(Appointment?.timeSlot?.[0]?.availableDate).format(
              "DD MMM,YYYY"
            )}
            time={Appointment?.timeSlot?.[0]?.availableTime}
            previousBooking
          />
        </View>

        <View style={styles.left_serviceCard}>
          <View style={styles.card_upper}>
            <Text style={styles.title}>
              {strings["You have 1 Service Left"]}
            </Text>
            <View style={styles.service_container}>
              <Text style={styles.servive_title}>{strings.Hair_color}</Text>
              <Text style={styles.service_rate}>₹500</Text>
            </View>
            <View style={styles.subtract_left}></View>
            <View style={styles.subtract_right}></View>
          </View>
          <View style={styles.card_down}>
            <Text style={styles.book_title}>
              {strings["Book Again Your Appointment"]}
            </Text>
          </View>
        </View>

        <View style={{ ...styles.whiteContainer, marginTop: hp(20) }}>
          <Text style={styles.titleStyle}>{strings["Bill Details"]}</Text>
          {Appointment?.services.map((item) => (
            <RowItemValue
              title={item?.service_name}
              value={"₹" + item?.price}
            />
          ))}
          <RowItemValue title="Payment Method" value="Cash" />
          <View style={styles.lineStyle} />
          <View style={styles.rowSpaceStyle}>
            <Text style={styles.valueTextStyle}>{"Total (INR)"}</Text>
            <Text style={styles.valueTextStyle}>{"₹" + price}</Text>
          </View>
        </View>

        <View style={{ ...styles.whiteContainer, marginTop: 0 }}>
          <Text style={styles.titleStyle}>{strings["Select Date"]}</Text>
          <WeekDateSelector
            list={dates}
            selectIndex={selectedDateIndex}
            onPressDate={(index) => onPressDateItem(index)}
          />
        </View>

        <View style={{ ...styles.whiteContainer, marginTop: 0 }}>
          <Text style={styles.titleStyle}>{strings["Select Time"]}</Text>
          <TimeSelector
            data={times}
            selectIndex={selectedTimeIndex}
            onPressTime={(index) => onPressTimeItem(index)}
          />
        </View>
      </ScrollView>

      <View style={styles.bottomStyle}>
        <TouchableOpacity onPress={onPressBook}>
          <ImageBackground
            resizeMode="cover"
            style={styles.bookImgStyle}
            source={images.book_button}
          >
            <Text style={styles.bookTextStyle}>
              {strings["Book  Appointment"]}
            </Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AppointmentReschedule;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
  },
  card: {
    marginTop: hp(25),
  },
  left_serviceCard: {
    backgroundColor: colors.primary_light_blue_4,
    paddingHorizontal: wp(15),
    marginHorizontal: wp(20),
    borderRadius: wp(8),
    paddingVertical: hp(17),
    flexDirection: "column",
    marginTop: hp(16),
  },
  card_upper: {
    borderBottomColor: colors.green_2,
    borderBottomWidth: 1,
    borderStyle: "dashed",
    paddingBottom: hp(20),
  },
  title: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black),
  },
  service_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: hp(10),
  },
  servive_title: {
    ...commonFontStyle(fontFamily.medium, 16, colors.grey_15),
  },
  service_rate: {
    ...commonFontStyle(fontFamily.medium, 16, colors.black),
  },
  card_down: {},
  book_title: {
    ...commonFontStyle(fontFamily.semi_bold, 16, colors.green_2),
    marginTop: hp(17),
    alignSelf: "center",
  },
  subtract_left: {
    width: wp(16),
    height: hp(17),
    backgroundColor: "#f2f2f2",
    borderRadius: wp(50),
    position: "absolute",
    left: -25,
    bottom: -8,
  },
  subtract_right: {
    width: wp(16),
    height: hp(17),
    backgroundColor: "#f2f2f2",
    borderRadius: wp(50),
    position: "absolute",
    right: -25,
    bottom: -8,
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
  whiteContainer: {
    marginHorizontal: wp(20),
    borderRadius: 8,
    padding: wp(13),
    backgroundColor: colors.white,
    marginBottom: hp(20),
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
    alignItems: "center",
    paddingBottom: hp(25),
    justifyContent: "center",
  },
  bookImgStyle: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(10),
  },
  bookTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black),
    paddingHorizontal: wp(80),
    paddingVertical: hp(20),
  },
});
