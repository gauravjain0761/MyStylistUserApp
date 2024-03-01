import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../theme/color";
import { hp, wp } from "../../helper/globalFunction";
import { BackIcon, SearchIcon } from "../../theme/SvgIcon";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { useNavigation } from "@react-navigation/native";

type Props = {
  title: string;
};

const BackHeader = ({ title }: Props) => {
  const { goBack } = useNavigation();

  const onPressBack = () => goBack();
  const onPressSearch = () => {};
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <TouchableOpacity onPress={onPressBack}>
        <BackIcon />
      </TouchableOpacity>
      <Text style={styles.titleTextStyle}>{title}</Text>
      <TouchableOpacity onPress={onPressSearch}>
        <SearchIcon />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default BackHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(17),
    paddingHorizontal: wp(20),
    backgroundColor: colors?.white,
  },
  titleTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors?.black),
    marginHorizontal: wp(10),
    flex: 1,
  },
});
