import React, { useCallback, useEffect, useState } from "react";
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
import { getAsyncUserInfo } from "../../helper/asyncStorage";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addToCart, removeToCart } from "../../actions";
import { ADD_TO_CART } from "../../actions/dispatchTypes";

type Props = {
  isOffer?: boolean;
  data: any;
  baseUrl?: string;
  count?: boolean;
  setCount?: any;
};
const StylistInnerItem = ({
  isOffer,
  data,
  baseUrl,
  count,
  setCount,
}: Props) => {
  const { addtocart, cartDetails } = useAppSelector((state) => state.cart);

  const onPressDelete = useCallback(async () => {
    let itemId = "";
    addtocart?.items?.map((item) => {
      if (item.serviceId == data.sub_services.sub_service_id) {
        itemId = item._id;
      }
    });
    let userInfo = await getAsyncUserInfo();
    let passData = {
      userId: userInfo?._id,
      itemId: itemId,
    };
    let obj = {
      data: passData,
      onSuccess: (response: any) => {
        setCount(false);
        console.log("ressponce", response);
      },
      onFailure: (Err: any) => {
        console.log("Errrr", Err);
      },
    };
    dispatch(removeToCart(obj));
  }, [count]);

  const dispatch = useAppDispatch();

  const onPressAdd = useCallback(async () => {
    let userInfo = await getAsyncUserInfo();
    let objs: any = {
      actionId: data?._id,
      serviceId: data?.sub_services?.sub_service_id,
      serviceName: data?.sub_services?.sub_service_name,
      serviceType: "Offer",
      price: data?.sub_services?.price,
      quantity: 1,
    };
    let passData = {
      userId: userInfo._id,
      expertId: data?.expert_id,
      items: [objs],
    };
    let obj = {
      data: passData,
      onSuccess: (response: any) => {
        dispatch({ type: ADD_TO_CART, payload: response.data });
        setCount(true);
      },
      onFailure: (Err: any) => {
        console.log("Errrr", Err);
      },
    };
    dispatch(addToCart(obj));
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
        {count == false ? (
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
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={onPressDelete}
              >
                <TrashIcon />
                <Text style={styles.countTextStyle}>ADDED</Text>
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
    ...commonFontStyle(fontFamily.semi_bold, 12, colors.green_2),
    marginHorizontal: wp(4),
  },
  plusTexStyke: {
    ...commonFontStyle(fontFamily.semi_bold, 20, colors.green_2),
  },
});

export default StylistInnerItem;
