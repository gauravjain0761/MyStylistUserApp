import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { BackHeader } from "../../components";
import { screenName } from "../../helper/routeNames";
import { strings } from "../../helper/string";
import { PlusIcon } from "../../theme/SvgIcon";
import { colors } from "../../theme/color";
import { hp, wp } from "../../helper/globalFunction";
import { commonFontStyle, fontFamily } from "../../theme/fonts";

const FaQ = () => {
  return (
    <View style={styles.conatiner}>
      <BackHeader title={strings.FAQ} />
      <View style={styles.faq_container}>
        <FlatList
          data={[1, 2, 3, 4, 5, 6, 7, 8]}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity style={styles.faq_list}>
                <Text style={styles.faq_title}>
                  What are your hours of operation?
                </Text>
                <PlusIcon />
              </TouchableOpacity>
            );
          }}
          ItemSeparatorComponent={() => <View style={styles.separator}></View>}
        />
      </View>
    </View>
  );
};

export default FaQ;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
  },
  faq_container: {
    marginHorizontal: wp(20),
    marginTop: hp(25),
  },
  faq_title: {
    ...commonFontStyle(fontFamily.medium, 16, colors.black),
  },
  faq_list: {
    backgroundColor: colors.primary_light_blue_5,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wp(20),
    paddingVertical: hp(18),
    borderRadius: wp(12),
  },
  separator: {
    height: hp(20),
  },
});
