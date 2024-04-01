import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import { hp, wp } from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { images } from "../../theme/icons";
import { strings } from "../../helper/string";
import { TrashIcon } from "../../theme/SvgIcon";

type Props = {
  isOffer?: boolean;
  data: any;
  baseUrl?: string;
};
const StylistInnerItem = ({ isOffer, data, baseUrl }: Props) => {
  const [count, setCount] = useState(0);

  const onPressDelete = useCallback(() => {
    setCount(count - 1);
  }, [count]);

  const onPressAdd = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  return (
    <View style={styles.container}>
      <View style={styles.cloumStyle}>
        <Text style={styles.labelTextStyle}>{data?.offer_name}</Text>
        <View style={styles.rowStyle}>
          <Text style={styles.priceStyle}>
            {"₹ "}
            {data?.sub_services?.price}
          </Text>
          {/* {isOffer ? (
            <Text style={styles.offerPriceStyle}>{"₹ 400"}</Text>
          ) : null} */}
        </View>
        <View style={{ flex: 1 }} />
        {count === 0 ? (
          <TouchableOpacity onPress={onPressAdd}>
            <ImageBackground
              resizeMode="contain"
              style={styles.btnStyle}
              source={images.green_button}
            >
              <Text style={styles.addTextStyle}>{strings["Add"]}</Text>
            </ImageBackground>
          </TouchableOpacity>
        ) : (
          <View>
            <ImageBackground
              resizeMode="contain"
              style={styles.btnStyle}
              source={images.green_button}
            >
              <TouchableOpacity onPress={onPressDelete}>
                <TrashIcon />
              </TouchableOpacity>
              <Text style={styles.countTextStyle}>{count}</Text>
              <TouchableOpacity onPress={onPressAdd}>
                <Text style={styles.plusTexStyke}>+</Text>
              </TouchableOpacity>
            </ImageBackground>
          </View>
        )}
      </View>
      <Image
        resizeMode="cover"
        style={styles.imgStyle}
        source={{ uri: baseUrl + "/" + data?.sub_services?.fileName }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingVertical: hp(15),
    paddingHorizontal: wp(20),
    borderBottomColor: colors.active_dot,
    flexDirection: "row",
  },
  cloumStyle: {
    flex: 1,
    marginRight: wp(5),
  },
  labelTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 16, colors.black),
  },
  priceStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 16, colors.black),
  },
  offerPriceStyle: {
    ...commonFontStyle(fontFamily.regular, 14, colors.gery_4),
    marginLeft: wp(10),
    textDecorationLine: "line-through",
  },
  rowStyle: {
    marginVertical: hp(10),
    flexDirection: "row",
    alignItems: "flex-start",
  },
  imgStyle: {
    height: wp(100),
    width: wp(110),
    borderRadius: 10,
  },
  btnStyle: {
    height: hp(30),
    width: wp(80),
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  addTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 16, colors.green_2),
  },
  countTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 16, colors.green_2),
    marginHorizontal: wp(14),
  },
  plusTexStyke: {
    ...commonFontStyle(fontFamily.semi_bold, 20, colors.green_2),
  },
});

export default StylistInnerItem;
