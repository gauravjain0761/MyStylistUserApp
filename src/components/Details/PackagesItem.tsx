import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  FlatList,
} from "react-native";
import {
  convertToOutput,
  generateWeekDates,
  hp,
  wp,
} from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import { ArrowUp } from "../../theme/SvgIcon";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { PackagesInnerItem } from "..";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getAsyncUserInfo } from "../../helper/asyncStorage";
import moment from "moment";
import { getExpertAvailability } from "../../actions/commonActions";
import { useRoute } from "@react-navigation/native";

type Props = {
  data: any;
  packages: any;
  index: number;
};

const PackagesItem = ({ packages, index }: Props) => {
  const [expanded, setExpanded] = useState(true);
  const { addtocart, cartDetails } = useAppSelector((state) => state.cart);

  const [dates, setDates] = useState([]);
  const [times, setTimes] = useState([]);
  const [bookTime, setBookTime] = useState({});
  const [date, setDate] = useState("");
  const [selectedDateIndex, setSelectedDate] = useState(0);
  const [selectedTimeIndex, setSelectedTime] = useState(0);
  const { params } = useRoute();

  const dispatch = useAppDispatch();

  const onPressArrow = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    setExpanded(!expanded);
  };

  useEffect(() => {
    async function getDatesList() {
      let data = generateWeekDates();

      let obj = {
        data: {
          startDate: moment(data?.[0]?.date).format("YYYY-MM-DD"),
          endDate: moment(data?.[data?.length - 1]?.date).format("YYYY-MM-DD"),
          timeSlotDuration: 60,
          expertId: params?.id,
        },
        onSuccess: (response: any) => {
          let data = convertToOutput(response);
          let time = data?.[0]?.value;
          setDates(data);
          let indexes = time
            ?.map((time: any, index: number) =>
              time?.isPast == false ? index : null
            )
            ?.filter((item) => item);
          setSelectedTime(indexes[0]);
          setDate(data[0]?.title);
          setTimes(data[0]?.value);
          setBookTime(time[indexes[0]]);
        },
        onFailure: () => {},
      };
      dispatch(getExpertAvailability(obj));
    }
    getDatesList();
  }, []);

  const onPressDateItem = (index: any) => {
    setSelectedDate(index);
    setDate(dates[index]?.title);
    setTimes(dates[index]?.value);
    setSelectedTime(0);
  };

  const onPressTimeItem = (index: any) => {
    setSelectedTime(index);
    let bookDates = times[index];
    setBookTime(bookDates);
  };

  return (
    <View key={index}>
      <TouchableOpacity onPress={onPressArrow} style={styles.headerRowStyle}>
        <Text style={styles.titleTextStyle}>{"Our Packages"}</Text>
        <View style={{ transform: [{ rotate: expanded ? "0deg" : "180deg" }] }}>
          <ArrowUp />
        </View>
      </TouchableOpacity>
      {expanded ? (
        <FlatList
          data={packages?.packages || []}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <PackagesInnerItem
                data={item}
                key={index}
                onPressDateItem={(index: any) => onPressDateItem(index)}
                onPressTimeItem={(index: any) => onPressTimeItem(index)}
                dates={dates}
                times={times}
                selectedDateIndex={selectedDateIndex}
                selectedTimeIndex={selectedTimeIndex}
                selectedTime={bookTime}
                selectedDate={date}
              />
            );
          }}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  headerRowStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: hp(10),
    alignItems: "center",
    paddingHorizontal: wp(20),
    marginTop: hp(30),
  },
  titleTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 20, colors.black),
  },
});

export default PackagesItem;
