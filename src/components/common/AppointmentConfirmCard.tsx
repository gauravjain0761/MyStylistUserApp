import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import {
  CalenderIcon,
  CarIcon,
  ClockIcon,
  RatingStars,
  StarIcon,
  VerifyIcon,
} from "../../theme/SvgIcon";
import { colors } from "../../theme/color";
import { hp, wp } from "../../helper/globalFunction";
import { fontFamily } from "../../theme/fonts";
import { commonFontStyle } from "../../theme/fonts";
import { images } from "../../theme/icons";
import { strings } from "../../helper/string";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "../../helper/routeNames";
import FastImage from "react-native-fast-image";

type props = {
  name?: string;
  rating?: string | number;
  onPress?: () => void;
  image?: any;
  date?: any;
  time?: any;
  isCompleted?: boolean;
  location?: string;
  service?: string;
  price?: string;
  jobs?: number | string;
};

const AppointmentConfirmCard = ({
  name,
  date,
  time,
  location,
  service,
  price,
  image,
  isCompleted,
  onPress,
  jobs,
  rating,
}: props) => {
  const { navigate } = useNavigation();

  const onPressCard = () => {
    navigate(screenName.YourStylist);
  };
  return (
    <View style={styles.conatiner}>
      <View style={styles.card_upper}>
        <View style={styles.img_container}>
          <View style={styles.img_con}>
            <FastImage resizeMode="cover" source={image} style={styles.img} />
          </View>
        </View>
        <TouchableOpacity onPress={onPressCard} style={styles.name_container}>
          <View style={styles.info_container}>
            <View>
              <Text style={styles.barber_name}>{name}</Text>
            </View>
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
            <Text style={styles.location_title}>{location}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.subtract_left}></View>
        <View style={styles.subtract_right}></View>
      </View>
      <View style={styles.card_down}>
        <View style={styles.down_contain}>
          <View style={styles.time_conatiner}>
            <View style={styles.time_img}>
              <ClockIcon />
              <Text style={styles.time_lable}>{strings.Time}</Text>
            </View>
            <Text style={styles.time}>{time}</Text>
          </View>
          <View style={styles.time_conatiner}>
            <View style={styles.time_img}>
              <CalenderIcon />
              <Text style={styles.time_lable}>{strings.Date}</Text>
            </View>
            <Text style={styles.time}>{date}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AppointmentConfirmCard;

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
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black),
    marginTop: hp(5),
  },
  location_container: {
    flexDirection: "row",
    gap: wp(5),
    marginTop: hp(8),
    alignItems: "center",
    alignSelf: "flex-start",
  },
  location_title: {
    ...commonFontStyle(fontFamily.medium, 14, colors.gery_9),
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
    gap: hp(16),
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
  time_conatiner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  time_img: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(6),
  },
  time_lable: {
    ...commonFontStyle(fontFamily.medium, 18, colors.gery_6),
  },
});
