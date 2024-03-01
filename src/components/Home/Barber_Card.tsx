import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React, { useState } from "react";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { barbers } from "../../helper/constunts";
import { hp, screen_width, wp } from "../../helper/globalFunction";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";
import {
  CarIcon,
  VerifyIcon,
  Offer_Badge,
  StarIcon,
} from "../../theme/SvgIcon";
import { strings } from "../../helper/string";
type props = {
  type: "with Service" | "Without Service";
  name: string;
  rating?: string | number;
  onPress?: () => void;
  containerStyle?: ViewStyle;
  location?: string;
  service?: string;
  price?: string;
  jobs?: number | string;
  offers?: number | string;
  images?: any;
};
const Barber_Card = ({
  type,
  name,
  containerStyle,
  jobs,
  location,
  offers,
  onPress,
  price,
  rating,
  service,
  images,
}: props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onSnapToItem = (index: React.SetStateAction<number>) => {
    setActiveIndex(index);
  };

  return (
    <>
      {type == "with Service" ? null : (
        <View style={styles.container}>
          <View style={styles.barber_card_container}>
            <View style={styles.image_conatiner}>
              <Carousel
                layout={"default"}
                data={images}
                sliderWidth={wp(132)}
                itemWidth={wp(132)}
                itemHeight={hp(144)}
                sliderHeight={hp(144)}
                inactiveSlideScale={1}
                renderItem={({ item }: any) => {
                  return (
                    <View style={styles?.carousel_img_container}>
                      <Image
                        source={item.image}
                        style={styles?.carousel_img}
                        resizeMode="stretch"
                      />
                    </View>
                  );
                }}
                onSnapToItem={onSnapToItem}
              />
              <View style={styles.offer_badge}>
                <Offer_Badge />
                <Text style={styles?.offer_title}>
                  {strings.Flat} {offers} {strings.OFF}
                </Text>
              </View>
              <Pagination
                dotsLength={images.length}
                activeDotIndex={activeIndex}
                containerStyle={styles?.pagination_container}
                dotStyle={styles?.dotStyle}
                inactiveDotStyle={styles?.inactiveDotStyle}
                inactiveDotScale={1}
                dotContainerStyle={styles?.dotContainerStyle}
              />
            </View>
            <View style={styles.barber_details_continer}>
              <View style={styles.name_container}>
                <TouchableOpacity onPress={onPress}>
                  <Text style={styles.barber_name}>{name}</Text>
                </TouchableOpacity>
                <VerifyIcon />
              </View>
              <View style={styles.barber_job_coantiner}>
                <View style={styles.rating_badge}>
                  <Text style={styles.rating_title}>{rating}</Text>
                  <View style={styles.star}>
                    <StarIcon />
                  </View>
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
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default Barber_Card;

const styles = StyleSheet.create({
  container: {},
  barber_card_container: {
    flexDirection: "row",
    borderBottomColor: colors.active_dot,
    borderBottomWidth: wp(1),
  },
  image_conatiner: {},
  carousel_img_container: {
    width: "100%",
    borderRadius: wp(20),
    overflow: "hidden",
  },
  carousel_img: {
    width: "100%",
    height: hp(144),
  },
  barber_details_continer: {
    marginLeft: wp(28),
    marginTop: hp(21),
  },
  barber_name: {
    ...commonFontStyle(fontFamily.bold, 28, colors.black),
  },
  name_container: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(6),
  },
  barber_job_coantiner: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(12),
  },
  rating_badge: {
    width: wp(39),
    height: wp(19),
    backgroundColor: colors.light_green,
    borderRadius: wp(6),
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: wp(5),
  },
  rating_title: {
    ...commonFontStyle(fontFamily.semi_bold, 12, colors.white),
  },
  seprator: {
    width: wp(4),
    height: wp(4),
    backgroundColor: colors.dark_grey,
    borderRadius: wp(50),
    marginHorizontal: wp(9),
  },
  jobs_title: {
    ...commonFontStyle(fontFamily.medium, 14, colors.dark_grey),
  },
  location_container: {
    flexDirection: "row",
    gap: wp(5),
    marginTop: hp(13),
    alignItems: "center",
  },
  location_title: {
    ...commonFontStyle(fontFamily.medium, 14, colors.dark_grey),
  },
  pagination_container: {
    justifyContent: "center",
    alignSelf: "center",
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: hp(10),
    marginBottom: hp(20),
  },
  dotContainerStyle: {
    margin: 0,
    marginHorizontal: wp(3),
  },
  inactiveDotStyle: {
    backgroundColor: colors?.active_dot,
  },
  dotStyle: {
    width: wp(4),
    height: wp(4),
    borderRadius: 5,
    backgroundColor: colors?.inactive_dot,
  },
  offer_badge: {
    width: wp(99),
    height: hp(20),
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: wp(12),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: wp(4),
    position: "absolute",
    top: hp(124),
  },
  offer_title: {
    ...commonFontStyle(fontFamily.semi_bold, 11, colors.black),
  },
  star: {
    // paddingBottom: hp(1),
  },
});
