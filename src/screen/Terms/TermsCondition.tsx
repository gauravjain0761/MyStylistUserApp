import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { BackHeader } from "../../components";
import { strings } from "../../helper/string";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";
import { hp, screen_width, wp } from "../../helper/globalFunction";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getTermsAndCondtition } from "../../actions/profileAction";
import RenderHtml from "react-native-render-html";

const TermsCondition = () => {
  const dispatch = useAppDispatch();
  const { getalltermsandconditions } = useAppSelector(
    (state) => state?.profile
  );
  useEffect(() => {
    dispatch(getTermsAndCondtition());
  }, []);

  const source = {
    html: getalltermsandconditions?.content,
  };

  return (
    <View style={styles.container}>
      <BackHeader title={strings.TermsConditions} />
      <ScrollView contentContainerStyle={styles.terms_style}>
        <Text style={styles.title}>{getalltermsandconditions?.title}</Text>
        <RenderHtml contentWidth={screen_width} source={source} />
      </ScrollView>
    </View>
  );
};

export default TermsCondition;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    ...commonFontStyle(fontFamily.semi_bold, 20, colors.black),
    alignSelf: "center",
    marginVertical: hp(20),
  },
  terms_style: {
    ...commonFontStyle(fontFamily.medium, 15, colors.gery_1),
    textAlign: "justify",
    paddingHorizontal: wp(10),
    lineHeight: hp(20),
  },
});
