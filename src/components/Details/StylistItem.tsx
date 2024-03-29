import React, { useCallback, useState } from "react";
import {
  FlatList,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { hp, wp } from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { ArrowUp, TrashIcon } from "../../theme/SvgIcon";
import { StylistInnerItem } from "..";

type Props = {
  isOffer?: boolean;
  data: any;
};

const StylistItem = ({ isOffer, data, offerList }: Props) => {
  const [expanded, setExpanded] = useState(true);

  const onPressArrow = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    setExpanded(!expanded);
  };

  return (
    <View>
      <TouchableOpacity onPress={onPressArrow} style={styles.headerRowStyle}>
        <Text style={styles.titleTextStyle}>{data?.offer_name}</Text>
        <View style={{ transform: [{ rotate: expanded ? "0deg" : "180deg" }] }}>
          <ArrowUp />
        </View>
      </TouchableOpacity>
      {expanded ? (
        <FlatList
          data={[1, 2]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return <StylistInnerItem isOffer={isOffer} data={item} />;
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
  rotationStyle: {},
});

export default StylistItem;
