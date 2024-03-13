import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { colors } from "../../theme/color";
import { hp, wp } from "../../helper/globalFunction";
import { images } from "../../theme/icons";
import {
  CarIcon,
  RatingStars,
  StarIcon,
  VerifyIcon,
} from "../../theme/SvgIcon";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { strings } from "../../helper/string";

type props = {
  type?: "Give Feedback" | "Rating" | "Total Price" | string;
  name?: string;
  rating?: string | number;
  onPress?: () => void;
  location?: string;
  service?: string;
  price?: string;
  image?: any;
  date?: any;
  time?: any;
  isCompleted?: boolean;
};

const BarberAppointmentCard = ({
  name,
  date,
  time,
  location,
  service,
  type,
  price,
  image,
  isCompleted,
  onPress,
}: props) => {
  return (
    <View style={styles.conatiner}>
      <View style={styles.card_upper}>
        <View style={styles.img_container}>
          <View style={styles.img_con}>
            <Image resizeMode="cover" source={image} style={styles.img} />
          </View>
        </View>
        <TouchableOpacity onPress={onPress} style={styles.name_container}>
          <View style={styles.info_container}>
            <View>
              <Text style={styles.barber_name}>{name}</Text>
            </View>
            <VerifyIcon width={14} height={14} />
          </View>
          {isCompleted ? (
            <View style={styles.date_container}>
              <Text style={styles.time}>
                {date}
                {time}
              </Text>
              <ImageBackground
                resizeMode="contain"
                source={images.completebadge}
                style={styles.complete_badge}
              >
                <Text style={styles.completed_title}>{strings.Completed}</Text>
              </ImageBackground>
            </View>
          ) : (
            <Text style={styles.time}>
              {time} {date}
            </Text>
          )}
          <View style={styles.location_container}>
            <CarIcon color={colors.grey_10} />
            <Text style={styles.location_title}>{location}</Text>
          </View>
          <Text style={styles.service_title}>{service}</Text>
        </TouchableOpacity>
        <View style={styles.subtract_left}></View>
        <View style={styles.subtract_right}></View>
      </View>
      <View style={styles.card_down}>
        <View style={styles.down_contain}>
          {type === "Total Price" ? (
            <Text style={styles.price}>{strings["Total (INR)"]}</Text>
          ) : type === "Rating" ? (
            <View style={styles.start_conatiner}>
              <RatingStars />
              <RatingStars />
              <RatingStars />
              <RatingStars />
              <RatingStars color={colors.active_dot} />
            </View>
          ) : type === "Give Feedback" ? (
            <Text style={styles.price}>{strings.Give_Feedback}</Text>
          ) : null}
          <Text style={styles.price}> ₹ {price}</Text>
        </View>
      </View>
    </View>
  );
};

export default BarberAppointmentCard;

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
    paddingBottom: hp(20),
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
  barber_info_conatiner: {},
  name_container: {
    alignItems: "center",
  },
  barber_name: {
    ...commonFontStyle(fontFamily.bold, 26, colors.black),
  },
  info_container: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(4),
    alignSelf: "flex-start",
  },
  time: {
    ...commonFontStyle(fontFamily.semi_bold, 12, colors.grey_10),
    marginTop: hp(5),
  },
  location_container: {
    flexDirection: "row",
    gap: wp(5),
    marginTop: hp(3),
    alignItems: "center",
    alignSelf: "flex-start",
  },
  location_title: {
    ...commonFontStyle(fontFamily.medium, 14, colors.grey_10),
  },
  service_title: {
    ...commonFontStyle(fontFamily.medium, 14, colors.grey_11),
    marginTop: hp(8),
    alignSelf: "flex-start",
  },
  card_upper: {
    flexDirection: "row",
    gap: wp(15),
    borderBottomColor: colors.dashed_boredr,
    borderBottomWidth: 1,
    borderStyle: "dashed",
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
  down_contain: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  price: {
    ...commonFontStyle(fontFamily.medium, 16, colors.black),
  },
  subtract_right: {
    width: wp(16),
    height: hp(17),
    backgroundColor: "#f2f2f2",
    borderRadius: wp(50),
    position: "absolute",
    right: -25,
    bottom: -8,
  },
  start_conatiner: {
    flexDirection: "row",
    gap: wp(7),
  },
  date_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: wp(10),
    alignItems: "flex-end",
    width: "auto",
    alignSelf: "flex-start",
  },
  complete_badge: {
    paddingHorizontal: wp(7),
    justifyContent: "center",
    alignItems: "center",
  },
  completed_title: {
    ...commonFontStyle(fontFamily.semi_bold, 10, colors.black_2),
    lineHeight: hp(20),
  },
});
