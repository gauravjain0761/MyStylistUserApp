import React, { useCallback, useEffect, useState } from "react";
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
import { ServiceInnerItem, StylistInnerItem } from "..";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getAsyncUserInfo } from "../../helper/asyncStorage";
import { getCartlist } from "../../actions";
import { CART_DETAILS } from "../../actions/dispatchTypes";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

type Props = {
  data: any;
  service: any;
  index: number;
  type?: string;
  baseUrl: string;
  actionId: string;
};

const ServiceItem = ({ data, service, index, baseUrl, actionId }: Props) => {
  const [expanded, setExpanded] = useState(true);

  const onPressArrow = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    setExpanded(!expanded);
  };

  return (
    <View key={index}>
      <TouchableOpacity onPress={onPressArrow} style={styles.headerRowStyle}>
        <Text style={styles.titleTextStyle}>{"Services"}</Text>
        <View style={{ transform: [{ rotate: expanded ? "0deg" : "180deg" }] }}>
          <ArrowUp />
        </View>
      </TouchableOpacity>
      {expanded ? (
        <FlatList
          data={service}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <ServiceInnerItem
                data={item}
                key={index}
                baseUrl={baseUrl}
                actionId={actionId}
                index={index}
              />
            );
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

export default ServiceItem;
