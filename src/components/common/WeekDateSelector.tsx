import moment from "moment";
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { hp, wp } from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import { commonFontStyle, fontFamily } from "../../theme/fonts";

type Item = {
  id: number;
  date: string;
  isSelected?: boolean;
};
type props = {
  list: Array<Item>;
  onPressDate: (number: number) => void;
};

const WeekDateSelector = ({ list, onPressDate }: props) => {
  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={list}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={() => onPressDate(index)}
              key={index}
              style={{
                ...styles.itemStyle,
                borderWidth: item?.isSelected ? 1.5 : 1,
                backgroundColor: item?.isSelected
                  ? colors.green_opacity
                  : colors.white,
                borderColor: item?.isSelected
                  ? colors.theme_1
                  : colors.date_slot_border,
              }}
            >
              <Text style={styles.varTextStyle}>
                {moment(item.date).format("ddd")}
              </Text>
              <View style={{ height: hp(5) }} />
              <Text style={styles.dayTextStyle}>
                {moment(item.date).format("D")}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: hp(5),
  },
  itemStyle: {
    height: hp(70),
    width: wp(53),
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: wp(2),
    marginRight: wp(8),
    justifyContent: "center",
    alignItems: "center",
    borderColor: colors.date_slot_border,
  },
  varTextStyle: {
    ...commonFontStyle(fontFamily.regular, 14, colors.black),
  },
  dayTextStyle: {
    ...commonFontStyle(fontFamily.bold, 22, colors.black),
  },
});

export default WeekDateSelector;
