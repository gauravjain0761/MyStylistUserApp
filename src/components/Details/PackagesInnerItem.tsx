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
import {
  PackagesIcon,
  PackagesText,
  TimingIcon,
  TrashIcon,
} from "../../theme/SvgIcon";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { images } from "../../theme/icons";
import { strings } from "../../helper/string";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  addToCart,
  getCartlist,
  removeMultipleCartItems,
  removeToCart,
} from "../../actions";
import {
  getAsyncCartId,
  getAsyncUserInfo,
  setAsyncCartId,
} from "../../helper/asyncStorage";
import { ADD_TO_CART, CART_DETAILS } from "../../actions/dispatchTypes";
import SelectDateModal from "../common/SelectDateModal";
import moment from "moment";

type Props = {
  data: any;
  count?: boolean;
  setCount?: any;
  onPressTimeItem?: (index: any) => void;
  onPressDateItem?: (index: any) => void;
  dates?: any;
  times?: any;
  selectedDateIndex?: number;
  selectedTimeIndex?: number;
  selectedTime?: any;
  selectedDate?: any;
};

const PackagesInnerItem = ({
  data,
  count,
  setCount,
  dates,
  onPressDateItem,
  onPressTimeItem,
  selectedDate,
  selectedDateIndex,
  selectedTimeIndex,
  selectedTime,
  times,
}: Props) => {
  const { addtocart, cartDetails } = useAppSelector((state) => state.cart);
  const [visible, setVisible] = useState(false);

  const dispatch = useAppDispatch();

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

  const onPressDelete = async () => {
    let cartId = await getAsyncCartId();
    let selected = [];
    await addtocart?.items?.forEach((item) => {
      data.service_name.forEach((items) => {
        if (item.serviceId == items?._id) {
          selected.push(item?._id);
        }
      });
    });
    let userInfo = await getAsyncUserInfo();
    let passData = {
      userId: userInfo?._id,
      itemIds: selected,
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
    dispatch(removeMultipleCartItems(obj));
  };

  const onPressAdd = async () => {
    setVisible(!visible);
  };

  const onPressApply = async () => {
    let userInfo = await getAsyncUserInfo();
    let items: any = [];
    data?.service_name.forEach((item: any) => {
      let obj: any = {
        actionId: data._id,
        serviceId: item?.service_id,
        serviceName: item?.service_name,
        serviceType: "Package",
        price: item?.total,
        quantity: 1,
      };
      items.push(obj);
    });
    let passData = {
      userId: userInfo._id,
      expertId: data?.expert_id,
      items: items,
    };
    let obj = {
      data: passData,
      onSuccess: async (response: any) => {
        dispatch({ type: ADD_TO_CART, payload: response?.data });
        await getCart();
      },
      onFailure: (Err: any) => {
        console.log("Errrr", Err);
      },
    };
    dispatch(addToCart(obj));
  };

  const isInCart = (item) => {
    return addtocart?.items?.some((items) => items?.actionId == item?._id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.cloumStyle}>
        <View style={styles.rowStyle}>
          <PackagesIcon />
          <View style={{ width: wp(3) }} />
          <PackagesText />
        </View>
        <Text style={styles.labelTextStyle}>{data?.package_name}</Text>
        <Text style={styles.priceTextStyle}>
          {"₹ "}
          {data?.rate}
        </Text>
        <View style={{ height: hp(8) }} />
        {data?.service_name?.map((item, index) => {
          return (
            <View style={styles.rowStyle}>
              <View style={styles.dotStyle} />
              <Text style={styles.boldTextStyle}>
                {item?.service_name}:{" "}
                <Text style={styles.greyTextStyle}>
                  {item?.sub_services
                    ?.map(
                      (sub_service_item: any, index: number) =>
                        sub_service_item?.sub_service_name
                    )
                    .join(", ")}
                </Text>
              </Text>
            </View>
          );
        })}
      </View>
      {isInCart(data) == false || isInCart(data) == undefined ? (
        <View style={styles.buttonBar}>
          <TouchableOpacity onPress={onPressAdd}>
            <ImageBackground
              resizeMode="contain"
              style={styles.btnStyle}
              source={images.green_button}
            >
              <Text style={styles.addTextStyle}>{strings["Add"]}</Text>
            </ImageBackground>
          </TouchableOpacity>
          <View style={styles.time}>
            <TimingIcon />
            <Text style={styles.timeTitle}>{"30 Min."}</Text>
          </View>
        </View>
      ) : (
        <View>
          <View style={styles.buttonBar}>
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
            <View style={styles.time}>
              <TimingIcon />
              <Text style={styles.timeTitle}>{"30 Min."}</Text>
            </View>
            <Text style={styles.selectedTime}>{`${selectedTime?.time}, ${moment(
              selectedDate
            )?.format("DD MMM, YYYY")}`}</Text>
          </View>
        </View>
      )}
      <SelectDateModal
        visible={visible}
        close={setVisible}
        dates={dates}
        onPressDateItem={(index) => onPressDateItem(index)}
        onPressTimeItem={(index) => onPressTimeItem(index)}
        setIsModal={setVisible}
        times={times}
        selectedDateIndex={selectedDateIndex}
        selectedTimeIndex={selectedTimeIndex}
        title={
          "Please select Date and Time for this Service from available slots"
        }
        withOutDisable={false}
        onPressApply={onPressApply}
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
    ...commonFontStyle(fontFamily.semi_bold, 12, colors.green_2),
    marginHorizontal: wp(4),
  },
  plusTexStyke: {
    ...commonFontStyle(fontFamily.semi_bold, 20, colors.green_2),
  },
  time: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(3),
  },
  timeTitle: {
    ...commonFontStyle(fontFamily.semi_bold, 12, colors.green_2),
  },
  buttonBar: {
    // flexDirection: "row",
    alignItems: "center",
    gap: wp(13),
  },
});

export default PackagesInnerItem;
