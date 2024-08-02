import {
  Image,
  ImageBackground,
  Pressable,
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
import { api } from "../../helper/apiConstants";
import FastImage from "react-native-fast-image";

type props = {
  type?: string;
  name?: string;
  rating?: number;
  onPress?: () => void;
  location?: string;
  service?: string;
  price?: string;
  image?: any;
  date?: any;
  time?: any;
  isCompleted?: boolean;
  imgBaseURL?: string;
  onPressFeedBack?: () => void;
  status: string;
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
  rating = 0,
  imgBaseURL,
  onPressFeedBack,
  status,
}: props) => {
  return (
    <Pressable style={styles.conatiner} onPress={onPress}>
      <View style={styles.card_upper}>
        <View style={styles.img_container}>
          <View style={styles.img_con}>
            <FastImage
              resizeMode="cover"
              style={styles.img}
              source={{
                uri: imgBaseURL + "/" + image,
                priority: FastImage.priority.high,
              }}
            />
          </View>
        </View>
        <View style={styles.name_container}>
          <View style={styles.info_container}>
            <View>
              <Text numberOfLines={1} style={styles.barber_name}>
                {name}
              </Text>
            </View>
            <VerifyIcon width={14} height={14} />
          </View>
          <View style={styles.date_container}>
            <Text style={styles.time}>
              {date}
              {time}
            </Text>
            <ImageBackground
              resizeMode="stretch"
              source={images.completebadge}
              style={styles.complete_badge}
            >
              <Text style={styles.completed_title}>{status}</Text>
            </ImageBackground>
          </View>
          {/* {isCompleted ? (
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
          )} */}
          <View style={styles.location_container}>
            <CarIcon width={25} height={25} color={colors.grey_10} />
            <Text style={styles.location_title}>{location}</Text>
          </View>
          <Text style={styles.service_title}>{service}</Text>
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.subtract_left}></View>
        <Image
          resizeMode="contain"
          style={styles.lineStyle}
          source={images.dashline}
        />
        <View style={styles.subtract_right}></View>
      </View>
      <View style={styles.card_down}>
        <View style={styles.down_contain}>
          <Text style={styles.price}>{strings["Total (INR)"]}</Text>
          <Text style={styles.price}> ₹ {price}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default BarberAppointmentCard;

const styles = StyleSheet.create({
  conatiner: {
    backgroundColor: colors.white,
    paddingHorizontal: wp(12),
    marginHorizontal: wp(15),
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
    backgroundColor: colors.grey_19,
  },
  barber_info_conatiner: {},
  name_container: {
    alignItems: "center",
  },
  barber_name: {
    ...commonFontStyle(fontFamily.semi_bold, 26, colors.black),
    maxWidth: wp(170),
  },
  info_container: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(4),
    alignSelf: "flex-start",
  },
  time: {
    ...commonFontStyle(fontFamily.semi_bold, 11, colors.grey_10),
    marginTop: hp(5),
    alignSelf: "flex-start",
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
    flexWrap: "wrap",
    maxWidth: wp(200),
  },
  card_upper: {
    flexDirection: "row",
    gap: wp(15),
    width: "100%",
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
    ...commonFontStyle(fontFamily.semi_bold, 11, colors.black_2),
    lineHeight: hp(20),
    textTransform: "capitalize",
  },
  feedbackTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 16, colors.black_2),
  },
  lineStyle: {
    width: "100%",
  },
});
