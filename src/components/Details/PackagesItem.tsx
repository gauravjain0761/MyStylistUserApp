import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  FlatList,
} from "react-native";
import { hp, wp } from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import { ArrowUp } from "../../theme/SvgIcon";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { PackagesInnerItem } from "..";
import { useAppSelector } from "../../redux/hooks";

type Props = {
  data: any;
  packages: any;
  index: number;
};

const PackagesItem = ({ packages, index }: Props) => {
  const [expanded, setExpanded] = useState(true);
  const { addtocart, cartDetails } = useAppSelector((state) => state.cart);

  const onPressArrow = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    setExpanded(!expanded);
  };

  return (
    <View key={index}>
      <TouchableOpacity onPress={onPressArrow} style={styles.headerRowStyle}>
        <Text style={styles.titleTextStyle}>{"Our Packages"}</Text>
        <View style={{ transform: [{ rotate: expanded ? "0deg" : "180deg" }] }}>
          <ArrowUp />
        </View>
      </TouchableOpacity>
      {expanded ? (
        <FlatList
          data={packages?.packages || []}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return <PackagesInnerItem data={item} key={index} />;
          }}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  headerRowStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: hp(10),
    alignItems: "center",
    paddingHorizontal: wp(20),
    marginTop: hp(30),
  },
  titleTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 20, colors.black),
  },
});

export default PackagesItem;
