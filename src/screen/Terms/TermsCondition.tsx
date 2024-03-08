import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { BackHeader } from "../../components";
import { strings } from "../../helper/string";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";
import { hp, wp } from "../../helper/globalFunction";

const TermsCondition = () => {
  return (
    <View style={styles.container}>
      <BackHeader title={strings.TermsConditions} />
      <Text style={styles.title}>{strings.TermsConditions}</Text>
      <Text style={styles.terms_style}>
        {
          strings[
            "By accessing and using My Stylist, the barber application provided by [Your Company Name], you agree to adhere to the following terms and conditions. You must be at least 18 years old to use the application, and by doing so, you confirm that you have the legal capacity to enter into binding agreements. When creating a user account, you are responsible for maintaining the confidentiality of your account information and for all activities conducted under your account. My Stylist reserves the right to suspend or terminate accounts found in violation of these terms or engaging in unlawful activities. The content provided within the application, including but not limited to text, images, and graphics, is for informational purposes only and should not be considered professional advice. You agree to use My Stylist solely for lawful purposes and not to engage in any activity that may harm, disrupt, or impair the application's functionality or integrity. The Company reserves the right to modify, suspend, or discontinue any aspect of My Stylist at any time without prior notice. Your continued use of the application following any changes constitutes acceptance of those changes. These terms and conditions constitute the entire agreement between you and the Company regarding your use of My Stylist and supersede any prior agreements or understandings. If you have any questions or concerns about these terms, please contact us for further assistance."
          ]
        }
      </Text>
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
