import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import {
  CalenderIcon,
  CallIcon,
  CarIcon,
  ChatIcon,
  ClockIcon,
  DirectionIcon,
  StarIcon,
  VerifyIcon,
} from "../../theme/SvgIcon";
import { hp, wp } from "../../helper/globalFunction";
import { fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";
import { commonFontStyle } from "../../theme/fonts";
import { strings } from "../../helper/string";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "../../helper/routeNames";
import { icons, images } from "../../theme/icons";
import FastImage from "react-native-fast-image";

type props = {
  type?: "Give Feedback" | "Rating" | "Total Price";
  name?: string;
  rating?: string | number;
  onPress?: () => void;
  containerStyle?: ViewStyle;
  location?: string;
  service?: string;
  price?: string;
  jobs?: number | string;
  userImg?: any;
  onPressRating?: any;
  date?: any;
  time?: any;
  previousBooking?: boolean;
  imgBaseURL?: string;
  onPressChat: () => void;
};

const AppointmentDetailCard = ({
  name,
  date,
  time,
  location,
  service,
  type,
  price,
  userImg,
  onPressRating,
  rating,
  jobs,
  previousBooking = false,
  imgBaseURL,
  onPressChat,
}: props) => {
  const { navigate } = useNavigation();

  const onPressCard = () => {};

  return (
    <View style={styles.conatiner}>
      <Pressable onPress={onPressCard} style={styles.card_upper}>
        <View style={styles.information_container}>
          <View style={styles.img_container}>
            <View style={styles.img_con}>
              <FastImage
                resizeMode="cover"
                source={{
                  uri: imgBaseURL + "/" + userImg,
                  priority: FastImage.priority.high,
                }}
                style={styles.img}
              />
            </View>
          </View>
          <View style={styles.name_container}>
            <View style={styles.info_container}>
              <TouchableOpacity>
                <Text numberOfLines={1} style={styles.barber_name}>
                  {name}
                </Text>
              </TouchableOpacity>
              <VerifyIcon width={14} height={14} />
            </View>
            <View style={styles.barber_job_coantiner}>
              <View style={styles.rating_badge}>
                <Text style={styles.rating_title}>{rating}</Text>
                <StarIcon />
              </View>
              <View style={styles.seprator}></View>
              <Text style={styles.jobs_title}>
                {jobs} {strings.Jobs_Done}
              </Text>
            </View>
            <View style={styles.location_container}>
              <CarIcon />
              <Text numberOfLines={1} style={styles.location_title}>
                {location}
              </Text>
            </View>
            <Text style={styles.service_title}>{service}</Text>
          </View>
        </View>
        <View style={styles.facility_conatiner}>
          <TouchableOpacity style={styles.service_btn}>
            <DirectionIcon />
            <Text style={styles.btn_title}>{strings.Directions}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressChat} style={styles.service_btn}>
            <ChatIcon />
            <Text style={styles.btn_title}>{strings.Chat}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.service_btn}>
            <CallIcon />
            <Text style={styles.btn_title}>{strings.Call_Stylist}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={styles.subtract_left}></View>
          <Image
            resizeMode="contain"
            style={{ width: "100%" }}
            source={images.dashline}
          />
          <View style={styles.subtract_right}></View>
        </View>
      </Pressable>
      <View style={styles.card_down}>
        <View style={styles.down_contain}>
          {previousBooking ? (
            <View style={styles.previous_container}>
              <Text style={styles.booking_title}>
                {strings.Previous_Booking}
              </Text>
              <Text style={styles.booking_time}>
                {time}, {date}
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.time_conatiner}>
                <View style={styles.time_img}>
                  <ClockIcon />
                  <Text style={styles.time_lable}>{strings.Time}</Text>
                </View>
                <Text style={styles.time}>{time}</Text>
              </View>
              <View style={styles.date_conatiner}>
                <View style={styles.date_img}>
                  <CalenderIcon />
                  <Text style={styles.time_lable}>{strings.Date}</Text>
                </View>
                <Text style={styles.time}>{date}</Text>
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default AppointmentDetailCard;

const styles = StyleSheet.create({
  conatiner: {
    backgroundColor: colors.white,
    paddingHorizontal: wp(15),
    marginHorizontal: wp(15),
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
    backgroundColor: colors.grey_19,
  },
  name_container: {
    alignItems: "center",
  },
  barber_name: {
    ...commonFontStyle(fontFamily.bold, 28, colors.black),
    maxWidth: wp(170),
  },
  info_container: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(4),
    alignSelf: "flex-start",
  },
  time: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black),
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
    ...commonFontStyle(fontFamily.medium, 15, colors.grey_9),
    flex: 1,
  },
  service_title: {
    ...commonFontStyle(fontFamily.medium, 15, colors.grey_11),
    marginTop: hp(8),
    alignSelf: "flex-start",
  },
  card_upper: {
    width: "100%",
  },
  subtract_left: {
    width: wp(16),
    height: hp(17),
    backgroundColor: "#f2f2f2",
    borderRadius: wp(50),
    position: "absolute",
    left: -24,
    bottom: -8,
  },
  card_down: {
    marginTop: wp(15),
  },
  down_contain: {
    flexDirection: "column",
    gap: hp(16),
  },
  subtract_right: {
    width: wp(16),
    height: hp(17),
    backgroundColor: "#f2f2f2",
    borderRadius: wp(50),
    position: "absolute",
    right: -24,
    bottom: -8,
  },
  barber_job_coantiner: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(12),
    alignSelf: "flex-start",
  },
  rating_badge: {
    backgroundColor: colors.light_green,
    borderRadius: wp(6),
    padding: hp(3),
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
    gap: wp(3),
  },
  rating_title: {
    ...commonFontStyle(fontFamily.semi_bold, 12, colors.white),
  },
  seprator: {
    width: wp(4),
    height: wp(4),
    backgroundColor: colors.dark_grey,
    borderRadius: wp(50),
    marginHorizontal: wp(7),
  },
  jobs_title: {
    ...commonFontStyle(fontFamily.medium, 14, colors.dark_grey),
  },
  facility_conatiner: {
    flexDirection: "row",
    marginBottom: hp(15),
    justifyContent: "space-between",
  },
  service_btn: {
    flexDirection: "row",
    gap: wp(5),
    alignItems: "center",
  },
  btn_title: {
    ...commonFontStyle(fontFamily.medium, 14, colors.black),
  },
  time_conatiner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date_conatiner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  time_img: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(6),
  },
  date_img: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(6),
  },
  time_lable: {
    ...commonFontStyle(fontFamily.medium, 18, colors.gery_6),
  },
  information_container: {
    gap: wp(17),
    flexDirection: "row",
    width: "100%",
  },
  previous_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  booking_title: {
    ...commonFontStyle(fontFamily.regular, 16, colors.gery_6),
  },
  booking_time: {
    ...commonFontStyle(fontFamily.semi_bold, 16, colors.black),
  },
});
