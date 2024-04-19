import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { strings } from "../../helper/string";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";
import { hp, wp } from "../../helper/globalFunction";
import { RatingStars, StarIcon } from "../../theme/SvgIcon";
import OvalShapView from "../common/OvalShapView";
import { ReviewFilter } from "../../helper/constunts";
import { useAppSelector } from "../../redux/hooks";
import moment from "moment";

const ReviewModal = ({ ratingItem, onPressFilterItem }: any) => {
  const [selectIndex, SetselectIndex] = useState(0);
  const { reviewData } = useAppSelector((state) => state.appointment);

  return (
    <View style={styles.container}>
      <View style={styles.title_container}>
        <Text style={styles.title}>
          {strings.All_Reviews} ({reviewData?.reviews?.length})
        </Text>
        <View style={styles.rating_conatiner}>
          <View style={styles.rating_badge}>
            <Text style={styles.rating_title}>{ratingItem?.averageRating}</Text>
            <StarIcon />
          </View>
          <Text style={styles.rating_counter_title}>
            ({ratingItem?.jobDone})
          </Text>
        </View>
      </View>

      <View style={styles.btn_container}>
        <FlatList
          data={ReviewFilter}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity>
                <OvalShapView
                  data={item}
                  selectIndex={selectIndex}
                  onPress={() => {
                    SetselectIndex(index);
                    onPressFilterItem(index);
                  }}
                  index={index}
                />
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <ScrollView
        style={styles.review_card_container}
        showsVerticalScrollIndicator={false}
      >
        {reviewData?.reviews?.length > 0 ? (
          <FlatList
            data={reviewData?.reviews}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              return (
                <View style={styles.card_container}>
                  <View style={styles.user_info_container}>
                    <View style={styles.user_info}>
                      <Image
                        resizeMode="cover"
                        source={{
                          uri:
                            reviewData?.featured_image_url +
                            "/" +
                            item?.userId?.user_profile_images?.[0]?.image,
                        }}
                        style={styles.image}
                      />
                      <View style={styles.user_title}>
                        <Text numberOfLines={1} style={styles.username}>
                          {item?.userId?.name +
                            item?.userId?.name +
                            item?.userId?.name}
                        </Text>
                        <Text style={styles.date}>
                          {moment(item?.createdAt).format("DD-MM-YYYY")}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.star_conatiner}>
                      {Array.from({ length: item?.star_rating || 0 }).map(
                        (e, inx) => {
                          return <RatingStars />;
                        }
                      )}
                      {Array.from({ length: 5 - (item?.star_rating || 0) }).map(
                        (e, inx) => {
                          return <RatingStars color={colors.grey_19} />;
                        }
                      )}
                    </View>
                  </View>
                  <Text style={styles.review_contntent}>{item.review}</Text>
                </View>
              );
            }}
          />
        ) : (
          <View style={styles.noTextContainer}>
            <Text style={styles.noTextStyle}>{"No Review"}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ReviewModal;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  title_container: {
    marginTop: hp(6),
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  title: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black),
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
  rating_conatiner: {
    alignItems: "center",
    flexDirection: "row",
    gap: wp(5),
  },
  rating_counter_title: {
    ...commonFontStyle(fontFamily.medium, 14, colors.info_grey_2),
  },
  btn_container: {
    flexDirection: "row",
    gap: wp(11),
    justifyContent: "flex-start",
    marginTop: hp(33),
    paddingBottom: hp(20),
  },
  review_container: {},
  btn_style: {
    paddingHorizontal: wp(10),
    paddingVertical: hp(9),
    justifyContent: "center",
    alignItems: "center",
  },
  btn_title: {
    ...commonFontStyle(fontFamily.medium, 13, colors.black_2),
    lineHeight: hp(20),
  },
  review_card_container: {
    width: "100%",
  },
  card_container: {
    borderWidth: 1,
    borderColor: colors.review_caed_border,
    paddingVertical: wp(20),
    width: "100%",
    borderRadius: wp(10),
    backgroundColor: colors.review_card_bg,
    marginVertical: hp(10),
  },
  user_info_container: {
    flexDirection: "row",
    marginHorizontal: wp(21),
    alignItems: "center",
    justifyContent: "space-between",
  },
  user_info: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(12),
  },
  image: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(40 / 2),
    backgroundColor: colors.grey_19,
  },
  user_title: {},
  review_contntent: {
    marginLeft: wp(21),
    textAlign: "justify",
    lineHeight: hp(20),
    marginRight: wp(15),
    marginTop: hp(16),
  },
  star_conatiner: {
    flexDirection: "row",
    gap: wp(5),
  },
  username: {
    ...commonFontStyle(fontFamily.semi_bold, 16, colors.black),
    lineHeight: hp(19),
    maxWidth: wp(120),
  },
  date: {
    ...commonFontStyle(fontFamily.medium, 14, colors.gery_6),
    lineHeight: hp(16),
  },
  noTextContainer: {
    height: hp(300),
    alignItems: "center",
    justifyContent: "center",
  },
  noTextStyle: {
    ...commonFontStyle(fontFamily.medium, 14, colors.gery_6),
  },
});
