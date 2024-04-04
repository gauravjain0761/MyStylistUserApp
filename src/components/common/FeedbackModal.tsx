import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Modals from "./Modals";
import { strings } from "../../helper/string";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";
import { icons, images } from "../../theme/icons";
import { hp, wp } from "../../helper/globalFunction";
import { RatingStars } from "../../theme/SvgIcon";

const FeedbackModal = ({ visible, close, onPresssubmit }) => {
  const [maxrating, setmaxRating] = useState([1, 2, 3, 4, 5]);
  const [defaultrating, setdefaultrating] = useState(0);
  const [input, setInput] = useState("");
  return (
    <View style={styles.conatiner}>
      <Modals
        visible={visible}
        close={close}
        isIcon
        contain={
          <View style={styles.modal_conatiner}>
            <Text style={styles.modal_title}>{strings.Feedback}</Text>
            <View style={styles.details_container}>
              <Image style={styles.img} source={images.barber5} />
              <Text style={styles.name}>Rate {strings.Majid_Khan}</Text>
            </View>
            <View style={styles.star_container}>
              {maxrating.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => setdefaultrating(item)}
                    activeOpacity={0.7}
                    key={item}
                  >
                    {item <= defaultrating ? (
                      <RatingStars width={wp(36)} height={wp(36)} />
                    ) : (
                      <RatingStars
                        width={wp(36)}
                        height={wp(36)}
                        color="#E9E9E9"
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.review_container}>
              <Text style={styles.title}>
                {strings["Add a detailed review"]}
              </Text>
              <TextInput
                editable
                numberOfLines={4}
                multiline
                style={styles.input}
                value={input}
                onChangeText={(e) => setInput(e)}
                placeholder="Write here..."
              />
            </View>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => onPresssubmit(defaultrating, input)}
            >
              <ImageBackground
                resizeMode="contain"
                style={styles.submitImgStyle}
                source={images.book_button}
              >
                <Text style={styles.submitTextStyle}>
                  {strings["Submit Feedback"]}
                </Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

export default FeedbackModal;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
  },
  modal_conatiner: {
    width: "100%",
  },
  modal_title: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black),
  },
  name: {
    ...commonFontStyle(fontFamily.medium, 16, colors.black),
  },
  img: {
    width: wp(90),
    height: wp(90),
    alignSelf: "center",
    borderRadius: wp(5),
  },
  details_container: {
    alignSelf: "center",
    gap: hp(7),
    marginTop: hp(35),
  },
  star_container: {
    marginTop: hp(20),
    flexDirection: "row",
    justifyContent: "center",
    gap: wp(5),
  },
  review_container: {
    marginTop: hp(60),
  },
  title: {
    ...commonFontStyle(fontFamily.medium, 16, colors.black),
  },
  input: {
    borderWidth: hp(1),
    borderColor: colors.review_caed_border,
    borderRadius: wp(6),
    backgroundColor: colors.review_card_bg,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "left",
    textAlignVertical: "top",
    paddingTop: hp(20),
    paddingHorizontal: wp(20),
    marginTop: hp(12),
  },
  submitImgStyle: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(10),
  },
  submitTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black),
    paddingHorizontal: wp(80),
    paddingVertical: hp(20),
  },
  btn: {
    marginTop: hp(30),
  },
});
