import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { BackHeader } from "../../components";
import { strings } from "../../helper/string";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";
import { hp, wp } from "../../helper/globalFunction";

const PrivacyPolicy = () => {
  return (
    <View style={styles.container}>
      <BackHeader title={strings.Privacy_Policy} />
      <ScrollView style={styles.mainContainer}>
        <Text style={styles.title}>{strings.Privacy_Policy}</Text>
        <Text style={styles.policy_style}>
          {
            strings[
              " My Stylist, collects personal information including names, email addresses, phone numbers, and location data to personalize user experiences and improve service quality. Usage data and device information are also gathered to analyze user behavior and ensure application compatibility. This information may be shared with third-party service providers for operational purposes or in the event of business transfers. We prioritize data security and take measures to protect information from unauthorized access or disclosure. Changes to our privacy policy will be promptly communicated, and users are encouraged to review updates periodically. For inquiries or concerns regarding our privacy practices, please contact us."
            ]
          }
        </Text>
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    ...commonFontStyle(fontFamily.semi_bold, 20, colors.black),
    alignSelf: "center",
    marginVertical: hp(20),
  },
  policy_style: {
    ...commonFontStyle(fontFamily.medium, 15, colors.gery_1),
    textAlign: "justify",
    marginHorizontal: wp(20),
    lineHeight: hp(20),
    marginBottom: hp(40),
  },
  mainContainer: {
    backgroundColor: colors.background_grey,
  },
});
