import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ViewStyle,
  TextStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../theme/color";
import { hp, wp } from "../../helper/globalFunction";
import { BackIcon, Hamburger, SearchIcon } from "../../theme/SvgIcon";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "../../helper/routeNames";
import { icons } from "../../theme/icons";

type Props = {
  title: string;
  isSearch?: boolean;
  isMenu?: boolean;
  isDelete?: boolean;
  onPressMenu?: () => void;
  onPressScreenSearch?: () => void;
  onPressDelete?: () => void;
  onPressScreenBack?: () => void;
  containerStyle?: ViewStyle;
  titleTextStyle?: TextStyle;
};

const BackHeader = ({
  title,
  isSearch,
  isDelete,
  isMenu,
  onPressMenu,
  onPressScreenSearch,
  onPressDelete,
  onPressScreenBack,
  containerStyle,
  titleTextStyle,
}: Props) => {
  const { goBack, navigate } = useNavigation();

  const onPressBack = () => {
    if (onPressScreenBack) {
      onPressScreenBack();
    } else {
      goBack();
    }
  };

  const onPressSearch = () => {
    if (onPressScreenSearch) {
      onPressScreenSearch();
    } else {
      // @ts-ignore
      navigate(screenName.SearchItem);
    }
  };
  return (
    <SafeAreaView style={[styles.container, containerStyle]} edges={["top"]}>
      {isMenu ? (
        <TouchableOpacity onPress={onPressMenu}>
          <Hamburger />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={onPressBack}>
          <BackIcon />
        </TouchableOpacity>
      )}

      <Text numberOfLines={1} style={[styles.titleTextStyle, titleTextStyle]}>
        {title}
      </Text>
      {isSearch ? (
        <TouchableOpacity onPress={onPressSearch}>
          <SearchIcon />
        </TouchableOpacity>
      ) : null}
      {isDelete ? (
        <TouchableOpacity onPress={onPressDelete}>
          <Image source={icons.delete_cart} style={styles.deleteIconStyle} />
        </TouchableOpacity>
      ) : null}
    </SafeAreaView>
  );
};

export default BackHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(10),
    paddingHorizontal: wp(20),
    backgroundColor: colors?.white,
  },
  titleTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors?.black),
    marginHorizontal: wp(10),
    flex: 1,
  },
  deleteIconStyle: {
    height: wp(20),
    width: wp(20),
  },
});
