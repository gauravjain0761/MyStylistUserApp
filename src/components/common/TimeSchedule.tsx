import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { hp, wp } from "../../helper/globalFunction";
import { fontFamily, commonFontStyle } from "../../theme/fonts";
import { colors } from "../../theme/color";
import moment from "moment";

type props = {
  Data?: any;
  ContainerStyle?: ViewStyle;
  ItemStyle?: ViewStyle;
  TimeStyle?: TextStyle;
};

const TimeSchedule = ({
  ContainerStyle,
  Data,
  ItemStyle,
  TimeStyle,
}: props) => {
  let timesArray = [];
  const morningTime = moment().startOf("day").add(10, "hours");
  const nightTime = moment().startOf("day").add(21, "hours");
  let Id = 0;
  let currentTime = morningTime.clone();
  while (currentTime.isSameOrBefore(nightTime)) {
    timesArray.push({
      Id: Id,
      Time: currentTime.format("hh:mm A"),
    });
    currentTime.add(1, "hours");
    Id++;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.select_time_conatiner, ContainerStyle]}>
        <ScrollView style={styles.timecontainer}>
          <FlatList
            data={timesArray}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              flexWrap: "wrap",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  style={[
                    styles.time_slot,
                    ItemStyle,
                    index % 2 == 0
                      ? { marginRight: wp(0) }
                      : { marginLeft: wp(4) },
                  ]}
                >
                  <Text style={[styles.time, TimeStyle]}>{item.Time}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default TimeSchedule;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    paddingHorizontal: wp(15),
  },
  select_time_conatiner: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(13),
    width: "100%",
  },
  timecontainer: {
    alignSelf: "center",
    width: "100%",
  },
  time_slot: {
    borderWidth: 1,
    borderColor: colors.date_slot_border,
    borderRadius: wp(5),
    paddingHorizontal: wp(6),
    paddingVertical: hp(5),
    alignItems: "center",
    marginBottom: 12,
    // width: wp(75),
  },
  time: {
    ...commonFontStyle(fontFamily.medium, 14, colors.black),
    lineHeight: hp(26),
  },
});
