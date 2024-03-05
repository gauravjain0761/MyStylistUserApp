import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { BackHeader } from "../../components";
import { strings } from "../../helper/string";
import AppointmentDetailCard from "../../components/common/AppointmentDetailCard";
import { images } from "../../theme/icons";
import { hp, wp } from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import { commonFontStyle, fontFamily } from "../../theme/fonts";

type RowItemValueProps = {
  title: string;
  value: string;
};

const RowItemValue = ({ title, value }: RowItemValueProps) => {
  return (
    <View style={styles.rowSpaceStyle}>
      <Text style={styles.greyTitleTextStyle}>{title}</Text>
      <Text style={styles.valueTextStyle}>{value}</Text>
    </View>
  );
};

const AppointmentDetails = () => {
  return (
    <View style={styles.conatiner}>
      <BackHeader title={strings.Appointment_Detail} />
      <ScrollView>
        <View style={styles.card_container}>
          <AppointmentDetailCard
            images={images.barber5}
            name={strings.Majid_Khan}
            rating={"4.6"}
            jobs={343}
            location={strings.Sector_Mohali}
            date={"26 May,2024"}
            time={"08:30PM"}
          />
        </View>

        <View style={styles.otp_conatiner}>
          <View style={styles.otp_detail_container}>
            <Text style={styles.otp_title}>
              {strings["OTP to start the service"]}
            </Text>
            <Text style={styles.otp_number}>4 4 2 5 2 5</Text>
          </View>
        </View>

        <View style={{ ...styles.whiteContainer, marginTop: 0 }}>
          <Text style={styles.titleStyle}>{strings["Bill Details"]}</Text>
          <RowItemValue title="Hair Cut" value="₹200" />
          <RowItemValue title="Beard Trim" value="₹100" />
          <RowItemValue title="Hair color" value="₹500" />
          <RowItemValue title="Discount Applied" value="-₹300" />
          <RowItemValue title="Tax" value="₹50" />
          <RowItemValue title="Payment Method" value="Cash" />
          <View style={styles.lineStyle} />
          <View style={styles.rowSpaceStyle}>
            <Text style={styles.valueTextStyle}>{"Total (INR)"}</Text>
            <Text style={styles.valueTextStyle}>{"₹550.00"}</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.elevationStyle}>
        <TouchableOpacity>
          <ImageBackground
            resizeMode="contain"
            style={styles.cartBtnStyle}
            source={images.grey_border_button}
          >
            <Text style={styles.goTextStyle}>{strings.Cancel}</Text>
          </ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity>
          <ImageBackground
            resizeMode="contain"
            style={styles.cartBtnStyle}
            source={images.blue_button}
          >
            <Text style={styles.goTextStyle}>{strings.Reschedule}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AppointmentDetails;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
  },
  card_container: {
    marginTop: hp(25),
  },
  otp_conatiner: {
    marginVertical: hp(19),
    backgroundColor: colors.primary_light_blue_4,
    paddingVertical: hp(18),
    paddingHorizontal: wp(23),
    marginHorizontal: hp(20),
    borderRadius: wp(8),
  },
  otp_title: {
    ...commonFontStyle(fontFamily.medium, 18, colors.green_3),
  },
  otp_number: {
    ...commonFontStyle(fontFamily.medium, 22, colors.green_3),
  },
  otp_detail_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  whiteContainer: {
    margin: 20,
    borderRadius: 8,
    padding: wp(13),
    backgroundColor: colors.white,
    marginBottom: hp(40),
  },
  titleStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black),
    marginBottom: hp(10),
  },
  lineStyle: {
    borderBottomWidth: 1,
    borderColor: colors.gery_7,
    marginVertical: hp(10),
  },
  rowSpaceStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: hp(10),
  },
  valueTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 16, colors.black),
  },
  greyTitleTextStyle: {
    ...commonFontStyle(fontFamily.regular, 16, colors.gery_6),
  },
  elevationStyle: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    backgroundColor: colors.white,
    padding: wp(20),
    flexDirection: "row",
    alignItems: "center",
  },
  priceTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 24, colors.black_2),
    flex: 1,
    textAlign: "center",
  },
  cartBtnStyle: {
    height: hp(60),
    width: wp(170),
    alignItems: "center",
    justifyContent: "center",
  },
  goTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black_2),
  },
});
