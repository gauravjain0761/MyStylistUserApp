import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { hp, wp } from "../../helper/globalFunction";
import { fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";
import { commonFontStyle } from "../../theme/fonts";
import { images } from "../../theme/icons";
import { CalenderIcon, ClockIcon, VerifyIcon } from "../../theme/SvgIcon";
import { strings } from "../../helper/string";

type props = {
  name?: string;
  date?: string;
  time?: string;
  image?: any;
};

const AppointmentCancelCard = ({ name, date, time, image }: props) => {
  return (
    <View style={styles.conatiner}>
      <View style={styles.card_upper}>
        <View style={styles.information_container}>
          <View style={styles.img_container}>
            <View style={styles.img_con}>
              <Image resizeMode="stretch" source={image} style={styles.img} />
            </View>
          </View>
          <View style={styles.name_container}>
            <View style={styles.info_container}>
              <TouchableOpacity>
                <Text style={styles.barber_name}>{name}</Text>
              </TouchableOpacity>
              <VerifyIcon width={14} height={14} />
            </View>
            <View style={styles.timing_conatiner}>
              <View style={styles.time_conatiner}>
                <View style={styles.time_img}>
                  <ClockIcon />
                  <Text style={styles.time_lable}>{strings.Time}</Text>
                </View>
                <Text style={styles.time}>{time}</Text>
              </View>
              <View style={styles.date_conatiner}>
                <View style={styles.time_img}>
                  <CalenderIcon />
                  <Text style={styles.time_lable}>{strings.Date}</Text>
                </View>
                <Text style={styles.time}>{date}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.subtract_left}></View>
        <View style={styles.subtract_right}></View>
      </View>
      <View style={styles.card_down}>
        <View style={styles.down_contain}>
          <Text style={styles.info_title}>{strings["Are you sure?"]}</Text>
          <Text style={styles.info_details}>
            {strings["you want to cancel your appointment with Majid Khan?"]}
          </Text>
          <View style={styles.btn_conatiner}>
            <TouchableOpacity>
              <ImageBackground resizeMode="stretch" source={images.gery_button}>
                <Text style={styles.btn_title}>No</Text>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity>
              <ImageBackground resizeMode="stretch" source={images.blue_button}>
                <Text style={styles.btn_title}>Yes</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AppointmentCancelCard;

const styles = StyleSheet.create({
  conatiner: {
    backgroundColor: colors.white,
    paddingHorizontal: wp(15),
    marginHorizontal: wp(20),
    borderRadius: wp(8),
    paddingVertical: hp(17),
    flexDirection: "column",
  },
  img_container: {
    alignSelf: "flex-start",
  },
  img_con: {
    width: wp(100),
    height: hp(110),
  },
  img: {
    width: "100%",
    height: hp(110),
    borderRadius: wp(10),
  },
  name_container: {
    alignItems: "center",
    width: "100%",
  },
  barber_name: {
    ...commonFontStyle(fontFamily.bold, 28, colors.black),
  },
  info_container: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(4),
    alignSelf: "flex-start",
  },
  card_upper: {
    borderBottomColor: colors.dashed_boredr,
    borderBottomWidth: 1,
    borderStyle: "dashed",
    paddingBottom: hp(24),
  },
  subtract_left: {
    width: wp(16),
    height: hp(17),
    backgroundColor: "#f2f2f2",
    borderRadius: wp(50),
    position: "absolute",
    left: -25,
    bottom: -8,
  },
  card_down: {
    marginTop: wp(15),
  },
  down_contain: {},
  subtract_right: {
    width: wp(16),
    height: hp(17),
    backgroundColor: "#f2f2f2",
    borderRadius: wp(50),
    position: "absolute",
    right: -25,
    bottom: -8,
  },

  time_conatiner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  information_container: {
    flexDirection: "row",
    gap: wp(17),
    width: "100%",
  },
  date_conatiner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  time_img: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(5),
  },
  time_lable: {
    ...commonFontStyle(fontFamily.medium, 16, colors.gery_6),
  },
  time: {
    ...commonFontStyle(fontFamily.semi_bold, 16, colors.black),
    marginTop: hp(5),
  },
  timing_conatiner: {
    marginTop: hp(16),
    gap: hp(10),
    alignSelf: "flex-start",
    maxWidth: wp(180),
    width: "100%",
  },
  info_title: {
    ...commonFontStyle(fontFamily.semi_bold, 22, colors.black),
    alignSelf: "center",
  },
  info_details: {
    ...commonFontStyle(fontFamily.medium, 16, colors.grey_16),
    alignSelf: "center",
    textAlign: "center",
    marginTop: hp(5),
    lineHeight: hp(24),
  },
  btn_title: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black_2),
    paddingHorizontal: wp(45),
    paddingVertical: hp(15),
  },
  btn_conatiner: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: wp(9),
    marginTop: hp(23),
  },
});
