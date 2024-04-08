import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors } from "../../theme/color";
import { CrossIcon } from "../../theme/SvgIcon";
import { hp, wp } from "../../helper/globalFunction";
import { icons, images } from "../../theme/icons";
import { strings } from "../../helper/string";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "../../helper/routeNames";
import { SafeAreaView } from "react-native-safe-area-context";

const Feedback = () => {
  const { navigate } = useNavigation();

  const onPressClose = () => {
    navigate(screenName.Home);
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <TouchableOpacity onPress={onPressClose} style={styles.close}>
        <CrossIcon />
      </TouchableOpacity>
      <View style={styles.conatin}>
        <Image
          source={images.feedback}
          resizeMode="contain"
          style={styles.img}
        />
        <Text style={styles.title}>
          {strings["Thank you for your valuable feedback!"]}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Feedback;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  conatin: {
    justifyContent: "center",
    alignItems: "center",
    gap: hp(40),
    height: "100%",
    marginTop: hp(-40),
  },
  close: {
    alignSelf: "flex-end",
    marginRight: wp(20),
    marginTop: hp(10),
    zIndex: 1,
  },
  img: {
    width: wp(140),
    height: wp(140),
  },
  title: {
    ...commonFontStyle(fontFamily.semi_bold, 20, colors.black),
    textAlign: "center",
    lineHeight: hp(30),
  },
});
