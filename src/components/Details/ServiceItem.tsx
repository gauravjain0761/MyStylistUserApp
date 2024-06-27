import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  ImageBackground,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  convertToOutput,
  generateWeekDates,
  hp,
  wp,
} from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { ArrowUp, TimingIcon, TrashIcon } from "../../theme/SvgIcon";
import { SelectDateModal, ServiceInnerItem, StylistInnerItem } from "..";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  getAsyncCartId,
  getAsyncUserInfo,
  setAsyncCartId,
} from "../../helper/asyncStorage";
import { addToCart, getCartlist, removeMultipleCartItems } from "../../actions";
import { ADD_TO_CART, CART_DETAILS } from "../../actions/dispatchTypes";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import moment from "moment";
import { getExpertAvailability } from "../../actions/commonActions";
import FastImage from "react-native-fast-image";
import { images } from "../../theme/icons";
import { strings } from "../../helper/string";

type Props = {
  data: any;
  service: any;
  index: number;
  type?: string;
  baseUrl: string;
  actionId: string;
};

const ServiceItem = ({ data, service, index, baseUrl, actionId }: Props) => {
  const [expanded, setExpanded] = useState(true);
  const [dates, setDates] = useState([]);
  const [times, setTimes] = useState([]);
  const [bookTime, setBookTime] = useState({});
  const [date, setDate] = useState("");
  const [selectedDateIndex, setSelectedDate] = useState(0);
  const [selectedTimeIndex, setSelectedTime] = useState(0);

  const dispatch = useAppDispatch();

  const onPressArrow = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    setExpanded(!expanded);
  };

  useEffect(() => {
    async function getDatesList() {
      let userInfo = await getAsyncUserInfo();
      let data = generateWeekDates();

      let obj = {
        data: {
          startDate: moment(data?.[0]?.date).format("YYYY-MM-DD"),
          endDate: moment(data?.[data?.length - 1]?.date).format("YYYY-MM-DD"),
          timeSlotDuration: 60,
          expertId: userInfo?._id,
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
        <Text style={styles.titleTextStyle}>{"Services"}</Text>
        <View style={{ transform: [{ rotate: expanded ? "0deg" : "180deg" }] }}>
          <ArrowUp />
        </View>
      </TouchableOpacity>
      {expanded ? (
        <FlatList
          data={service}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <ServiceInnerItem
                data={item}
                key={index}
                baseUrl={baseUrl}
                actionId={actionId}
                index={index}
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
  rotationStyle: {},
  container: {
    borderBottomWidth: 1,
    paddingVertical: hp(15),
    paddingHorizontal: wp(20),
    borderBottomColor: colors.active_dot,
    flexDirection: "row",
  },
  cloumStyle: {
    flex: 1,
    marginRight: wp(5),
  },
  labelTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 16, colors.black),
  },
  priceStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 16, colors.black),
  },
  offerPriceStyle: {
    ...commonFontStyle(fontFamily.regular, 14, colors.gery_4),
    marginLeft: wp(10),
    textDecorationLine: "line-through",
  },
  rowStyle: {
    marginVertical: hp(10),
    flexDirection: "row",
    alignItems: "flex-start",
  },
  imgStyle: {
    height: wp(100),
    width: wp(110),
    borderRadius: 10,
  },
  btnStyle: {
    height: hp(30),
    width: wp(80),
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  addTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 16, colors.green_2),
  },
  countTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 12, colors.green_2),
    marginHorizontal: wp(4),
  },
  plusTexStyke: {
    ...commonFontStyle(fontFamily.semi_bold, 20, colors.green_2),
  },
  buttonBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(13),
  },
  time: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(3),
  },
  timeTitle: {
    ...commonFontStyle(fontFamily.semi_bold, 12, colors.green_2),
  },
  whiteContainer: {
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  titleStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black),
    marginBottom: hp(10),
  },
  info: {
    ...commonFontStyle(fontFamily.medium, 14, colors.gery_4),
    alignSelf: "center",
    lineHeight: hp(24),
    marginTop: hp(24),
  },
  selectedTime: {
    ...commonFontStyle(fontFamily.medium, 10, colors.grey_21),
    marginTop: hp(8),
  },
});

export default ServiceItem;
