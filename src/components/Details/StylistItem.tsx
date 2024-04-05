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
import { StylistInnerItem } from "..";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getAsyncUserInfo } from "../../helper/asyncStorage";
import { getCartlist } from "../../actions";
import { CART_DETAILS } from "../../actions/dispatchTypes";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

type Props = {
  isOffer?: boolean;
  data: any;
  offers: any;
};

const StylistItem = ({ isOffer, data, offers }: Props) => {
  const [expanded, setExpanded] = useState(true);
  const { addtocart, cartDetails } = useAppSelector((state) => state.cart);
  const [count, setCount] = useState(false);
  const dispatch = useAppDispatch();

  const onPressArrow = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    setExpanded(!expanded);
  };

  useEffect(() => {
    getCart();
  }, []);

  const getStatus = useCallback(async () => {
    cartDetails?.cart?.items.map((items, index) => {
      return offers?.offers.map((item) => {
        if (item?.sub_services?.sub_service_id == items?.serviceId) {
          setCount(true);
        } else {
          setCount(false);
        }
      });
    });
  }, [count]);

  const getCart = useCallback(async () => {
    console.log("hi");
    let userInfo = await getAsyncUserInfo();
    let obj = {
      data: {
        userId: userInfo._id,
      },
      onSuccess: (response: any) => {
        dispatch({ type: CART_DETAILS, payload: response?.data });
        getStatus();
      },
      onFailure: (Errr: any) => {
        console.log("Errr", Errr);
      },
    };
    dispatch(getCartlist(obj));
  }, [count]);

  return (
    <View>
      <TouchableOpacity onPress={onPressArrow} style={styles.headerRowStyle}>
        <Text style={styles.titleTextStyle}>{"Offers"}</Text>
        <View style={{ transform: [{ rotate: expanded ? "0deg" : "180deg" }] }}>
          <ArrowUp />
        </View>
      </TouchableOpacity>
      {expanded ? (
        <FlatList
          data={offers?.offers}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <StylistInnerItem
                isOffer={isOffer}
                data={item}
                key={index}
                baseUrl={offers?.featured_image_url}
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
  rotationStyle: {},
});

export default StylistItem;
