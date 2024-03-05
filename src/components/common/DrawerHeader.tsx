import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { hp, wp } from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import { fontFamily } from "../../theme/fonts";
import { commonFontStyle } from "../../theme/fonts";
import { Hamburger } from "../../theme/SvgIcon";

type Props = {
  title: string;
  isSearch?: boolean;
  onPressManu?: () => void;
};

const DrawerHeader = ({ title, onPressManu }: Props) => {
  const { goBack } = useNavigation();

  const onPressBack = () => goBack();
  const onPressSearch = () => {};
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <TouchableOpacity onPress={onPressManu}>
        <Hamburger />
      </TouchableOpacity>
      <Text style={styles.titleTextStyle}>{title}</Text>
      {/* {isSearch ? (
        <TouchableOpacity onPress={onPressSearch}>
          <SearchIcon />
        </TouchableOpacity>
      ) : null} */}
    </SafeAreaView>
  );
};

export default DrawerHeader;

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
