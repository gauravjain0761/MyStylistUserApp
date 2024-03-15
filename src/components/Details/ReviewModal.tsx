import {
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { strings } from "../../helper/string";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";
import { hp, wp } from "../../helper/globalFunction";
import { RatingStars, StarIcon } from "../../theme/SvgIcon";
import { images } from "../../theme/icons";
import { useNavigation } from "@react-navigation/native";
import OvalShapView from "../common/OvalShapView";
import Filter_Button from "../common/Filter_Button";
import { ReviewFilter } from "../../helper/constunts";

const ReviewModal = () => {
  const [selectIndex, SetselectIndex] = useState(0);
  return (
    <View style={styles.container}>
      <View style={styles.title_container}>
        <Text style={styles.title}>{strings.All_Reviews} (5210)</Text>
        <View style={styles.rating_conatiner}>
          <View style={styles.rating_badge}>
            <Text style={styles.rating_title}>4.6</Text>
            <StarIcon />
          </View>
          <Text style={styles.rating_counter_title}>(56)</Text>
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
                  onPress={SetselectIndex}
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
        <FlatList
          data={[1, 2, 3, 4]}
          showsVerticalScrollIndicator={false}
          renderItem={() => {
            return (
              <View style={styles.card_container}>
                <View style={styles.user_info_container}>
                  <View style={styles.user_info}>
                    <Image source={images.review_user} style={styles.image} />
                    <View style={styles.user_title}>
                      <Text style={styles.username}>
                        {strings.Jeffery_Bills}
                      </Text>
                      <Text style={styles.date}>21-04-2023</Text>
                    </View>
                  </View>
                  <View style={styles.star_conatiner}>
                    <RatingStars />
                    <RatingStars />
                    <RatingStars />
                    <RatingStars />
                    <RatingStars />
                  </View>
                </View>
                <Text style={styles.review_contntent}>
                  {
                    strings[
                      "The environment here was quiet aand relaxing.The owner who gets thiings a done was very considerate, calm, and quiet accommodating to people tyukil questions and request."
                    ]
                  }
                </Text>
              </View>
            );
          }}
        />
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
  },
  date: {
    ...commonFontStyle(fontFamily.medium, 14, colors.gery_6),
    lineHeight: hp(16),
  },
});
