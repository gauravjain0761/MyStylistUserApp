import moment from "moment";
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ViewStyle,
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
  containerStyle?: ViewStyle;
  itemSeparator?: ViewStyle;
  itemStyle?: ViewStyle;
};

const WeekDateSelector = ({
  list,
  onPressDate,
  containerStyle,
  itemSeparator,
  itemStyle,
}: props) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <FlatList
        horizontal
        data={list}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={() => onPressDate(index)}
              key={index}
              style={[
                {
                  ...styles.itemStyle,
                  borderWidth: item?.isSelected ? 1.5 : 1,
                  backgroundColor: item?.isSelected
                    ? colors.green_opacity
                    : colors.white,
                  borderColor: item?.isSelected
                    ? colors.theme_1
                    : colors.date_slot_border,
                },
                itemStyle,
              ]}
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
        ItemSeparatorComponent={() => (
          <View style={[styles.items_separators, itemSeparator]}></View>
        )}
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
  items_separators: {
    width: wp(13),
  },
});

export default WeekDateSelector;
