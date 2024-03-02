import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { hp, wp } from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import { fontFamily, commonFontStyle } from "../../theme/fonts";
import { strings } from "../../helper/string";
import moment from "moment";

type props = {
  Data?: any;
  ContainerStyle?: ViewStyle;
  ItemStyle?: ViewStyle;
  DateStyle?: ViewStyle;
  DayStyle?: ViewStyle;
  LastDate?: number;
};

const DateSchedule = ({
  Data,
  ContainerStyle,
  ItemStyle,
  DateStyle,
  DayStyle,
  LastDate = 5,
}: props) => {
  const currentDate = moment();
  let datesArray = [];
  for (let i = 0; i < LastDate; i++) {
    const nextDate = currentDate.clone().add(i, "days");
    datesArray.push({
      id: i,
      Date: nextDate.format("DD"),
      Day: nextDate.format("ddd"),
    });
  }

  return (
    <View style={styles.container}>
      <View style={[styles.select_date_conatiner, ContainerStyle]}>
        <View style={styles.date_container}>
          <FlatList
            data={datesArray}
            showsHorizontalScrollIndicator={false}
            horizontal
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity style={[styles.date_slot, ItemStyle]}>
                  <Text style={[styles.day, DayStyle]}>{item.Day}</Text>
                  <Text style={[styles.date, DateStyle]}>{item.Date}</Text>
                </TouchableOpacity>
              );
            }}
            ItemSeparatorComponent={() => (
              <View style={styles.slot_separator}></View>
            )}
          />
        </View>
      </View>
    </View>
  );
};

export default DateSchedule;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  select_date_conatiner: {
    marginHorizontal: wp(10),
  },
  date_container: {
    justifyContent: "center",
    marginTop: hp(16),
    height: hp(70),
  },
  date_slot: {
    borderWidth: wp(1),
    borderRadius: wp(5),
    borderColor: colors.date_slot_border,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(17),
    paddingVertical: hp(10),
  },
  slot_separator: {
    width: wp(14),
  },
  date: {
    ...commonFontStyle(fontFamily.semi_bold, 22, colors.black),
  },
  day: {
    ...commonFontStyle(fontFamily.regular, 14, colors.black),
    lineHeight: hp(26),
  },
});
