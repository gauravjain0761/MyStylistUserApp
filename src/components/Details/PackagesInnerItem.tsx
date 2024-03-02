import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { hp, wp } from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import { PackagesIcon, PackagesText, TrashIcon } from "../../theme/SvgIcon";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { images } from "../../theme/icons";
import { strings } from "../../helper/string";

type Props = {
  data: any;
};

const PackagesInnerItem = ({ data }: Props) => {
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
        <View style={styles.rowStyle}>
          <PackagesIcon />
          <View style={{ width: wp(3) }} />
          <PackagesText />
        </View>
        <Text style={styles.labelTextStyle}>{"Hair and waxing Pack"}</Text>
        <Text style={styles.priceTextStyle}>{"₹ 200"}</Text>
        <View style={{ height: hp(8) }} />
        <View style={styles.rowStyle}>
          <View style={styles.dotStyle} />
          <Text style={styles.boldTextStyle}>
            Waxing:{" "}
            <Text style={styles.greyTextStyle}>
              {"Full arm - Rica Roll on Hair"}
            </Text>
          </Text>
        </View>
        <View style={{ ...styles.rowStyle, marginVertical: hp(2) }}>
          <View style={styles.dotStyle} />
          <Text style={styles.boldTextStyle}>
            Hair spa:{" "}
            <Text style={styles.greyTextStyle}>{"Loreal Products"}</Text>
          </Text>
        </View>
      </View>
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
  rowStyle: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: hp(5),
  },
  cloumStyle: {
    flex: 1,
  },
  labelTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black),
  },
  priceTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 16, colors.black),
    marginVertical: hp(5),
  },
  boldTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 12, colors.black),
  },
  greyTextStyle: {
    ...commonFontStyle(fontFamily.regular, 12, colors.gery_5),
  },
  dotStyle: {
    height: wp(4),
    width: wp(4),
    borderRadius: wp(4 / 2),
    backgroundColor: colors.black,
    marginRight: wp(5),
  },
  btnStyle: {
    height: hp(30),
    width: wp(80),
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: hp(10),
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

export default PackagesInnerItem;
