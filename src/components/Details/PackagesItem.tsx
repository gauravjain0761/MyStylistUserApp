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
  const [count, setCount] = useState(false);

  useEffect(() => {
    CheckStatus();
  }, []);

  const CheckStatus = useCallback(() => {
    if (addtocart.length > 0 || Object.keys(addtocart).length > 0) {
      console.log(addtocart);
      packages?.packages.map((item, index) => {
        addtocart?.items.map((items, index) => {
          if (items?.serviceType == "Package") {
            if (item?.service_name[0]?._id == items?.serviceId) {
              setCount(true);
            } else {
              setCount(false);
            }
          }
        });
      });
    } else {
      setCount(false);
    }
  }, [count]);

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
            return (
              <PackagesInnerItem
                data={item}
                key={index}
                count={count}
                setCount={setCount}
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
});

export default PackagesItem;
