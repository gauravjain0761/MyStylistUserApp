import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import Modals from "./Modals";
import { hp, wp } from "../../helper/globalFunction";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";
import WeekDateSelector from "./WeekDateSelector";
import { strings } from "../../helper/string";
import TimeSelector from "./TimeSelector";
import { images } from "../../theme/icons";

type props = {
  visible: boolean;
  close: (value: boolean) => void;
  dates: any;
  onPressDateItem: (value: any) => void;
  times: any;
  onPressTimeItem: (value: any) => void;
  setIsModal: (value: boolean) => void;
  selectedDateIndex: number;
  selectedTimeIndex: number;
  onPressApply: () => void;
};

const SelectDateModal = ({
  visible,
  close,
  dates,
  onPressDateItem,
  times,
  onPressTimeItem,
  setIsModal,
  selectedDateIndex,
  selectedTimeIndex,
  onPressApply,
}: props) => {
  return (
    <Modals
      visible={visible}
      close={close}
      contain={
        <View style={styles.select_date_container}>
          <Text style={styles.select_date_title}>{strings.Select_Date}</Text>
          <View style={styles.week_container}>
            <WeekDateSelector
              list={dates}
              onPressDate={(index) => onPressDateItem(index)}
              containerStyle={styles.date_container}
              itemStyle={styles.item_style}
              selectIndex={selectedDateIndex}
            />
          </View>
          <View style={styles.time_container}>
            <Text style={styles.time_title}>{strings.Select_Time}</Text>
            <View style={styles.timeselect_container}>
              <TimeSelector
                data={times}
                withOutDisable={true}
                onPressTime={(index) => onPressTimeItem(index)}
                itemStyle={styles.timeslot_style}
                selectIndex={selectedTimeIndex}
              />
            </View>
          </View>
          <Text style={styles.info}>
            {
              strings[
                "Timing can be adjusted by calling the Stylist after Booking"
              ]
            }
          </Text>
          <View style={styles.btn_container}>
            <TouchableOpacity onPress={() => setIsModal(!visible)}>
              <ImageBackground
                source={images.grey_border_button}
                style={styles.btn_style}
                resizeMode="contain"
              >
                <Text style={styles.btn_tite}>{strings.Cancel}</Text>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={
                !(selectedDateIndex !== null && selectedTimeIndex !== null)
              }
              onPress={() => {
                setIsModal(!visible);
                if (onPressApply) onPressApply();
              }}
            >
              <ImageBackground
                source={images?.blue_button}
                style={styles.btn_style}
                resizeMode="contain"
              >
                <Text style={styles.btn_tite}>{strings.Apply}</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  select_date_container: {
    width: "100%",
  },
  week_container: {
    marginHorizontal: wp(10),
    marginTop: hp(16),
  },
  item_style: {
    width: wp(62),
    height: hp(70),
  },
  timeslot_style: {
    marginBottom: hp(16),
  },
  service_modal_container: {},
  modal_title: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black),
  },
  select_date_title: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black),
    marginTop: hp(20),
    paddingHorizontal: wp(10),
  },
  time_container: {
    marginTop: hp(31),
    paddingHorizontal: wp(10),
  },
  time_title: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black),
  },
  timeselect_container: {
    alignItems: "center",
    marginTop: hp(10),
  },
  date_container: {
    width: "100%",
  },

  btn_style: {
    height: hp(60),
    width: wp(150),
    justifyContent: "center",
    alignItems: "center",
  },
  btn_tite: {
    ...commonFontStyle(fontFamily.medium, 18, colors.black),
  },
  btn_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: hp(10),
    marginTop: hp(41),
    marginHorizontal: wp(10),
  },
  info: {
    ...commonFontStyle(fontFamily.regular, 13.3, colors.info_grey),
    alignSelf: "center",
    marginTop: hp(25),
    // marginHorizontal: wp(15),
  },
});

export default SelectDateModal;
