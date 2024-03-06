import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { hp, wp } from "../../helper/globalFunction";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { BackIcon } from "../../theme/SvgIcon";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme/color";
import { strings } from "../../helper/string";
import { icons } from "../../theme/icons";

type props = {
  onChangeText: (value: string) => void;
  value: string;
  onFocus?: () => void;
  onBlur?: () => void;
};

const SearchBar = ({ onChangeText, value, onFocus, onBlur }: props) => {
  const { goBack, navigate } = useNavigation();

  const onPressBack = () => goBack();

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <TouchableOpacity onPress={onPressBack}>
        <BackIcon />
      </TouchableOpacity>
      <View style={styles.search_container}>
        <Image
          source={icons.search_placehonder}
          style={styles?.search_icon}
          resizeMode="contain"
        />
        <TextInput
          style={styles?.input}
          placeholderTextColor={colors.gery_6}
          placeholder={strings.Search_by_Stylist_Name}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(17),
    paddingHorizontal: wp(20),
    backgroundColor: Colors.white,
  },
  search_container: {
    marginLeft: wp(15),
    flex: 1,
    backgroundColor: colors.grey_14,
    height: hp(41),
    borderRadius: wp(4),
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    margin: 0,
  },
  search_icon: {
    width: wp(24),
    height: wp(24),
    marginLeft: wp(16),
  },
  input: {
    marginLeft: wp(5),
  },
  search_box: {},
});

export default SearchBar;
