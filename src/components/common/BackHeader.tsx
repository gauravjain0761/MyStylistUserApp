import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../theme/color";
import { hp, wp } from "../../helper/globalFunction";
import { BackIcon, Hamburger, SearchIcon } from "../../theme/SvgIcon";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "../../helper/routeNames";

type Props = {
  title: string;
  isSearch?: boolean;
  isMenu?: boolean;
  onPressMenu?: () => void;
  onPressScreenSearch?: () => void;
};

const BackHeader = ({
  title,
  isSearch,
  isMenu,
  onPressMenu,
  onPressScreenSearch,
}: Props) => {
  const { goBack, navigate } = useNavigation();

  const onPressBack = () => goBack();

  const onPressSearch = () => {
    if (onPressScreenSearch) {
      onPressScreenSearch();
    } else {
      // @ts-ignore
      navigate(screenName.SearchItem);
    }
  };
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {isMenu ? (
        <TouchableOpacity onPress={onPressMenu}>
          <Hamburger />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={onPressBack}>
          <BackIcon />
        </TouchableOpacity>
      )}

      <Text numberOfLines={1} style={styles.titleTextStyle}>
        {title}
      </Text>
      {isSearch ? (
        <TouchableOpacity onPress={onPressSearch}>
          <SearchIcon />
        </TouchableOpacity>
      ) : null}
    </SafeAreaView>
  );
};

export default BackHeader;

const styles = StyleSheet.create({
  _container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(10),
    paddingHorizontal: wp(20),
    backgroundColor: colors?.white,
  },
  get container() {
    return this._container;
  },
  set container(value) {
    this._container = value;
  },
  titleTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors?.black),
    marginHorizontal: wp(10),
    flex: 1,
  },
});
