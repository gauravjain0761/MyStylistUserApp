import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { hp, wp } from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { images } from "../../theme/icons";
import { strings } from "../../helper/string";
import { TrashIcon } from "../../theme/SvgIcon";
import {
  getAsyncCartId,
  getAsyncUserInfo,
  setAsyncCartId,
} from "../../helper/asyncStorage";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  addToCart,
  getCartlist,
  removeMultipleCartItems,
  removeToCart,
} from "../../actions";
import { ADD_TO_CART, CART_DETAILS } from "../../actions/dispatchTypes";
import FastImage from "react-native-fast-image";
import { useIsFocused } from "@react-navigation/native";

type Props = {
  isOffer?: boolean;
  data: any;
  baseUrl?: string;
  count?: boolean;
  setCount?: any;
  actionId?: string;
  index?: number;
};
const ServiceInnerItem = ({ data, baseUrl, actionId, index }: Props) => {
  const { addtocart } = useAppSelector((state) => state.cart);

  const getCart = async () => {
    console.log("callll");
    let userInfo = await getAsyncUserInfo();
    let obj = {
      data: {
        userId: userInfo._id,
      },
      onSuccess: async (response: any) => {
        await setAsyncCartId(response?.data?.cart?._id);
        let initialvalue = 0;
        dispatch({
          type: ADD_TO_CART,
          payload: { items: [...response?.data?.cart?.items] },
        });
        isInCart(data);
        if (response.data?.cart?.items?.length > 0) {
          let total = response.data?.cart?.items?.reduce(
            (accumulator, curruntvalue) => curruntvalue.price + accumulator,
            initialvalue
          );
          dispatch({
            type: CART_DETAILS,
            payload: { ...response?.data, total: total },
          });
        } else {
          dispatch({
            type: CART_DETAILS,
            payload: {},
          });
        }
      },
      onFailure: (Errr: any) => {
        if (Errr?.data?.message === "Cart not found") {
          dispatch({
            type: CART_DETAILS,
            payload: {},
          });
          dispatch({ type: ADD_TO_CART, payload: [] });
        }
      },
    };
    dispatch(getCartlist(obj));
  };

  const onPressDelete = async (items) => {
    let itemId = addtocart?.items?.map((item) => {
      if (item.serviceId == data.sub_service_id) {
        return item._id;
      }
    });

    let cartId = await getAsyncCartId();
    let userInfo = await getAsyncUserInfo();
    let passData = {
      userId: userInfo?._id,
      itemIds: itemId,
      cartId: cartId,
    };
    let obj = {
      data: passData,
      onSuccess: async (response: any) => {
        await getCart();
      },
      onFailure: (Err: any) => {
        console.log("Errrr", Err);
      },
    };
    console.log("ememememe", passData, itemId);
    dispatch(removeMultipleCartItems(obj));
  };
  const dispatch = useAppDispatch();

  const onPressAdd = async () => {
    let userInfo = await getAsyncUserInfo();

    let objs: any = {
      actionId: data?.sub_service_id,
      serviceId: data?.sub_service_id,
      serviceName: data?.sub_service_name,
      serviceType: "Service",
      price: data?.price,
      quantity: 1,
    };
    let passData = {
      userId: userInfo._id,
      expertId: actionId,
      items: [objs],
    };
    let obj = {
      data: passData,
      onSuccess: async (response: any) => {
        dispatch({ type: ADD_TO_CART, payload: response.data });
        await getCart();
      },
      onFailure: (Err: any) => {
        console.log("Errrr", Err);
      },
    };
    dispatch(addToCart(obj));
  };

  const isInCart = (item) => {
    return addtocart?.items?.some(
      (items) => items?.serviceId == item.sub_service_id
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.cloumStyle}>
        <Text style={styles.labelTextStyle}>{data?.sub_service_name}</Text>
        <View style={styles.rowStyle}>
          <Text style={styles.priceStyle}>
            {"₹ "}
            {data?.price}
          </Text>
        </View>
        <View style={{ flex: 1 }} />
        {isInCart(data) == false || isInCart(data) == undefined ? (
          <TouchableOpacity
            style={{ alignSelf: "flex-start" }}
            onPress={onPressAdd}
          >
            <ImageBackground
              resizeMode="contain"
              style={[styles.btnStyle]}
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
      <FastImage
        resizeMode="cover"
        style={styles.imgStyle}
        source={{
          uri: baseUrl + "/" + data?.fileName,
          priority: FastImage.priority.high,
        }}
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
    alignSelf: "flex-start",
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

export default ServiceInnerItem;
