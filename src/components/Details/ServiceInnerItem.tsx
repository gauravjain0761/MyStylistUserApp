import React, { memo, useCallback, useEffect, useState } from "react";
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
import { TimingIcon, TrashIcon } from "../../theme/SvgIcon";
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
import Modals from "../common/Modals";
import WeekDateSelector from "../common/WeekDateSelector";
import TimeSelector from "../common/TimeSelector";
import SelectDateModal from "../common/SelectDateModal";
import moment from "moment";

type Props = {
  isOffer?: boolean;
  data: any;
  baseUrl?: string;
  count?: boolean;
  setCount?: any;
  actionId?: string;
  index?: number;
  onPressTimeItem?: (index: any) => void;
  onPressDateItem?: (index: any) => void;
  dates?: any;
  times?: any;
  selectedDateIndex?: number;
  selectedTimeIndex?: number;
  selectedTime?: any;
  selectedDate?: any;
};
const ServiceInnerItem = ({
  data,
  baseUrl,
  actionId,
  index,
  onPressDateItem,
  onPressTimeItem,
  selectedDateIndex,
  selectedTimeIndex,
  dates,
  times,
  selectedTime,
  selectedDate,
}: Props) => {
  const { addtocart } = useAppSelector((state) => state.cart);
  const [visible, setVisible] = useState(false);
  const dispatch = useAppDispatch();

  const getCart = async () => {
    console.log("carrrtttcalllllll");
    let userInfo = await getAsyncUserInfo();
    let obj = {
      data: {
        userId: userInfo?._id,
      },
      onSuccess: async (response: any) => {
        await setAsyncCartId(response?.data?.cart?.cart_id);
        dispatch({
          type: ADD_TO_CART,
          payload: response?.data?.cart,
        });
        isInCart(data);
        timeCounter(data);
      },
      onFailure: (Errr: any) => {
        console.log("Errrr", Errr);
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
    let serviceId = "";
    addtocart?.services?.forEach((item) => {
      item?.subServices?.forEach((service) => {
        if (service?.subServiceId == items?.sub_service_id?._id) {
          serviceId = service?._id;
        }
      });
    });

    let cartId = await getAsyncCartId();
    let userInfo = await getAsyncUserInfo();
    let passData = {
      userId: userInfo?._id,
      itemIds: [serviceId],
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

  const onPressAdd = useCallback(async () => {
    setVisible(!visible);
  }, [visible]);

  const isInCart = (item) => {
    return addtocart?.services?.some((items) =>
      items?.subServices?.some(
        (service) => service?.subServiceId == item?.sub_service_id?._id
      )
    );
  };

  const onPressApply = async () => {
    let userInfo = await getAsyncUserInfo();
    let DateString = `${selectedDate} ${selectedTime?.time}`;
    let momentDate = moment(DateString, "YYYY-MM-DD hh:mm A").toISOString();

    let objs: any = {
      actionId: data?.service_id?._id,
      serviceId: data?.service_id?._id,
      serviceName: data?.service_id?.service_name,
      quantity: 1,
      timeSlot: momentDate,
      packageDetails: null,
      subServices: [
        {
          subServiceId: data?.sub_service_id?._id,
          subServiceName: data?.sub_service_id?.sub_service_name,
          originalPrice: data?.price,
          discountedPrice: 0,
        },
      ],
    };
    let passData = {
      userId: userInfo._id,
      expertId: actionId,
      services: [objs],
      packages: [],
      offers: [],
    };
    console.log(objs?.subServices?.[0]);
    let obj = {
      data: passData,
      onSuccess: async (response: any) => {
        await getCart();
      },
      onFailure: (Err: any) => {
        console.log("ServiceInner Err", Err);
      },
    };

    dispatch(addToCart(obj));
  };

  const timeCounter = (item) => {
    return addtocart?.services?.map((items) =>
      items?.subServices?.map(
        (service) =>
          service?.subServiceId == item?.sub_service_id?._id &&
          moment(items?.timeSlot)?.format("hh:mmA, DD MMM, YYYY")
      )
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.cloumStyle}>
        <Text style={styles.labelTextStyle}>
          {data?.sub_service_id?.sub_service_name}
        </Text>
        <View style={styles.rowStyle}>
          <Text style={styles.priceStyle}>
            {"₹ "}
            {data?.price}
          </Text>
        </View>
        <View style={{ flex: 1 }} />
        {isInCart(data) == false || isInCart(data) == undefined ? (
          <View style={styles.buttonBar}>
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
                  onPress={() => onPressDelete(data)}
                >
                  <TrashIcon />
                  <Text style={styles.countTextStyle}>ADDED</Text>
                </TouchableOpacity>
              </ImageBackground>
              <View style={styles.time}>
                <TimingIcon />
                <Text style={styles.timeTitle}>{"30 Min."}</Text>
              </View>
            </View>
            <Text style={styles.selectedTime}>{timeCounter(data)}</Text>
          </View>
        )}
      </View>
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
      <FastImage
        resizeMode="cover"
        style={styles.imgStyle}
        source={{
          uri: baseUrl + "/" + data?.sub_service_id?.fileName,
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
  buttonBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(13),
  },
  time: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(3),
  },
  timeTitle: {
    ...commonFontStyle(fontFamily.semi_bold, 12, colors.green_2),
  },
  whiteContainer: {
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  titleStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black),
    marginBottom: hp(10),
  },
  info: {
    ...commonFontStyle(fontFamily.medium, 14, colors.gery_4),
    alignSelf: "center",
    lineHeight: hp(24),
    marginTop: hp(24),
  },
  selectedTime: {
    ...commonFontStyle(fontFamily.medium, 10, colors.grey_21),
    marginTop: hp(8),
  },
});

export default ServiceInnerItem;
