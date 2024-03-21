import {
  Image,
  StyleSheet,
  Text,
  TextStyle,
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
  carouselitemWidth?: ViewStyle | TextStyle | any;
  carouselitemHeight?: ViewStyle | TextStyle | any;
  onPressRating?: any;
  isNewYearOffer?: boolean;
  barberdetailscontinerStyle?: ViewStyle | TextStyle;
  data?: any;
  img_url?: string;
};
const FavouriteCard = ({
  data,
  type,
  name,
  jobs,
  location,
  offers,
  onPress = () => "",
  price,
  rating,
  service,
  images,
  carouselitemHeight = wp(144),
  carouselitemWidth = wp(132),
  onPressRating = () => "",
  isNewYearOffer,
  barberdetailscontinerStyle,
  img_url,
}: props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onSnapToItem = (index: React.SetStateAction<number>) => {
    setActiveIndex(index);
  };

  return (
    <>
      {type == "with Service" ? (
        <View style={styles.container}>
          <View style={styles.barber_card_container}>
            <View style={styles.image_conatiner}>
              <View style={styles.carousel_view}>
                <Carousel
                  layout={"default"}
                  data={data?.user_profile_images}
                  sliderWidth={carouselitemWidth}
                  itemWidth={carouselitemWidth}
                  itemHeight={carouselitemHeight}
                  sliderHeight={carouselitemHeight}
                  inactiveSlideScale={1}
                  renderItem={({ item }: any) => {
                    return (
                      <View style={styles?.carousel_img_container}>
                        <Image
                          source={{
                            uri: data?.user_profile_images_url + data?.image,
                          }}
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
              </View>
              <Pagination
                dotsLength={data?.user_profile_images?.length}
                activeDotIndex={activeIndex}
                containerStyle={styles?.pagination_container}
                dotStyle={styles?.dotStyle}
                inactiveDotStyle={styles?.inactiveDotStyle}
                inactiveDotScale={1}
                dotContainerStyle={styles?.dotContainerStyle}
              />
            </View>
            <TouchableOpacity
              onPress={onPress}
              style={[
                styles.barber_details_continer,
                barberdetailscontinerStyle,
              ]}
            >
              <View style={styles.name_container}>
                <View>
                  <Text style={styles.barber_name}>{name}</Text>
                </View>
                <VerifyIcon width={14} height={14} />
              </View>
              <View style={styles.barber_job_coantiner}>
                <TouchableOpacity
                  onPress={() => onPressRating(true)}
                  style={styles.rating_badge}
                >
                  <Text style={styles.rating_title}>{rating}</Text>
                  <StarIcon />
                </TouchableOpacity>
                <View style={styles.seprator}></View>
                <Text style={styles.jobs_title}>
                  {jobs} {strings.Jobs_Done}
                </Text>
              </View>
              <View style={styles.location_container}>
                <CarIcon />
                <Text style={styles.location_title}>{location}</Text>
              </View>
              <View style={styles.price_container}>
                <Text style={styles.price_title}>{service}</Text>
                <Text style={styles.price_title}>{price}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.barber_card_container}>
            <View style={styles.image_conatiner}>
              <View style={styles.carousel_view}>
                <Carousel
                  layout={"default"}
                  data={data?.user_profile_images}
                  sliderWidth={carouselitemWidth}
                  itemWidth={carouselitemWidth}
                  itemHeight={carouselitemHeight}
                  sliderHeight={carouselitemHeight}
                  inactiveSlideScale={1}
                  renderItem={({ item }: any) => {
                    return (
                      <View style={styles?.carousel_img_container}>
                        <Image
                          source={{
                            uri: img_url + item?.image,
                          }}
                          style={[styles?.carousel_img, carouselitemHeight]}
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
              </View>
              <Pagination
                dotsLength={images?.length}
                activeDotIndex={activeIndex}
                containerStyle={styles?.pagination_container}
                dotStyle={styles?.dotStyle}
                inactiveDotStyle={styles?.inactiveDotStyle}
                inactiveDotScale={1}
                dotContainerStyle={styles?.dotContainerStyle}
              />
            </View>
            <TouchableOpacity
              onPress={onPress}
              style={[
                styles.barber_details_continer,
                barberdetailscontinerStyle,
              ]}
            >
              <View style={styles.name_container}>
                <View>
                  <Text style={styles.barber_name}>{data?.name}</Text>
                </View>
                <VerifyIcon width={14} height={14} />
              </View>
              <View style={styles.barber_job_coantiner}>
                <TouchableOpacity
                  onPress={() => onPressRating(true)}
                  style={styles.rating_badge}
                >
                  <Text style={styles.rating_title}>{rating}</Text>
                  <StarIcon />
                </TouchableOpacity>
                <View style={styles.seprator}></View>
                <Text style={styles.jobs_title}>
                  {jobs} {strings.Jobs_Done}
                </Text>
              </View>
              <View style={styles.location_container}>
                <CarIcon />
                <Text style={styles.location_title}>
                  {data?.city?.[0]?.city_name}
                  {","}
                  {data?.district?.[0]?.district_name}
                  {","}
                  {data?.state?.[0]?.state_name}
                </Text>
              </View>
              {isNewYearOffer ? (
                <>
                  <View style={styles.dashlineStyle} />
                  <View style={styles.rowSpaceStyle}>
                    <Text style={styles.newofferTextStyle}>
                      {strings["New Year Offer"]}
                    </Text>
                    <Text style={styles.newofferTextStyle}>{"₹1299"}</Text>
                  </View>
                </>
              ) : null}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

export default FavouriteCard;

const styles = StyleSheet.create({
  container: {
    paddingBottom: hp(20),
    borderBottomWidth: wp(1),
    borderBottomColor: colors.active_dot,
  },
  barber_card_container: {
    flexDirection: "row",
    // borderBottomColor: colors.active_dot,
    // borderBottomWidth: wp(1),
    // backgroundColor: "green",
  },
  image_conatiner: {},
  carousel_img_container: {
    width: "100%",
  },
  carousel_img: {
    width: "100%",
    height: hp(144),
  },
  barber_details_continer: {
    paddingLeft: wp(28),
    justifyContent: "center",
    width: "100%",
  },
  barber_name: {
    ...commonFontStyle(fontFamily.bold, 26, colors.black),
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
  location_container: {
    flexDirection: "row",
    gap: wp(5),
    marginTop: hp(8),
    alignItems: "center",
  },
  location_title: {
    ...commonFontStyle(fontFamily.medium, 13, colors.dark_grey),
  },
  pagination_container: {
    justifyContent: "center",
    alignSelf: "center",
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: hp(13),
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
    right: "30%",
  },
  offer_title: {
    ...commonFontStyle(fontFamily.semi_bold, 11, colors.black),
  },
  carousel_view: {
    width: "100%",
    borderRadius: wp(15),
    overflow: "hidden",
  },
  price_container: {
    paddingTop: hp(10),
    justifyContent: "space-between",
    flexDirection: "row",
    borderTopWidth: 1,
    marginTop: hp(10),
    borderTopColor: colors.dashed_boredr,
    borderStyle: "dashed",
  },
  price_title: {
    ...commonFontStyle(fontFamily.semi_bold, 16, colors.dark_grey_1),
  },
  dashlineStyle: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.dashed_boredr,
    marginVertical: hp(8),
  },
  rowSpaceStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: hp(3),
  },
  newofferTextStyle: {
    ...commonFontStyle(fontFamily.regular, 14, colors.black),
  },
});
