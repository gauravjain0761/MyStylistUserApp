import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { hp, wp } from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import { commonFontStyle, fontFamily } from "../../theme/fonts";

type Item = {
  id: number;
  time: string;
};

type props = {
  data: Array<Item>;
  onPressTime: (number: number) => void;
  containerStyle?: ViewStyle;
  itemStyle?: ViewStyle;
  selectIndex: number;
};

const TimeSelector = ({
  data,
  onPressTime,
  containerStyle,
  itemStyle,
  selectIndex,
}: props) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {data?.map((item: any, index: number) => {
        return (
          <TouchableOpacity
            onPress={() => onPressTime(index)}
            key={index}
            style={[
              {
                ...styles.itemContainer,
                borderWidth: selectIndex === index ? 1.5 : 1,
                backgroundColor:
                  selectIndex === index ? colors.green_opacity : colors.white,
                borderColor:
                  selectIndex === index
                    ? colors.theme_1
                    : colors.date_slot_border,
              },
              itemStyle,
            ]}
          >
            <Text style={styles.timeTextStyle}>{item.time}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  itemContainer: {
    height: hp(40),
    width: wp(70),
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: wp(12),
    alignItems: "center",
    justifyContent: "center",
  },
  timeTextStyle: {
    ...commonFontStyle(fontFamily.regular, 14, colors.black),
  },
});

export default TimeSelector;
