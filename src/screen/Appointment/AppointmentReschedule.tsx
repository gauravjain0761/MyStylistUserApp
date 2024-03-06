import {
  BackHandler,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import AppointmentDetailCard from "../../components/common/AppointmentDetailCard";
import {
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
  const [dates, setDates] = useState(generateWeekDates());
  const [times, setTimes] = useState(generateTimes());

  const { navigate } = useNavigation();

  const onPressDateItem = (item: any) => {
    let data = [...dates];

    dates.map((eItem, index) => {
      if (eItem.id === item.id) {
        eItem.isSelected = true;
      } else {
        eItem.isSelected = false;
      }
    });
    setDates(data);
  };

  const onPressTimeItem = (item: any) => {
    let data = [...times];
    times.map((eItem, index) => {
      if (eItem.id === item.id) {
        eItem.isSelected = true;
      } else {
        eItem.isSelected = false;
      }
    });
    setTimes(data);
  };

  const onPressBook = () => {
    navigate(screenName.AppointmentConfirm);
  };

  return (
    <View style={styles.conatiner}>
      <BackHeader title={strings.Appointment_Detail} />
      <ScrollView>
        <View style={styles.card}>
          <AppointmentDetailCard
            images={images.barber5}
            name={strings.Majid_Khan}
            rating={"4.6"}
            jobs={343}
            location={strings.Sector_Mohali}
            date={"26 May,2024"}
            time={"08:30PM"}
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

        <View style={{ ...styles.whiteContainer, marginTop: 0 }}>
          <Text style={styles.titleStyle}>{strings["Select Date"]}</Text>
          <WeekDateSelector
            list={dates}
            onPressDate={(index) => onPressDateItem(dates[index])}
          />
        </View>

        <View style={{ ...styles.whiteContainer, marginTop: 0 }}>
          <Text style={styles.titleStyle}>{strings["Select Time"]}</Text>
          <TimeSelector
            data={times}
            onPressTime={(index) => onPressTimeItem(times[index])}
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
