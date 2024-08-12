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
import SelectDateModal from "../common/SelectDateModal";
import moment from "moment";
import PromptModal from "./PromptModal";

type Props = {
  isOffer?: boolean;
  data: any;
  baseUrl?: string;
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
  actionId?: string;
};
const StylistInnerItem = ({
  data,
  baseUrl,
  count,
  setCount,
  dates,
  isOffer,
  onPressDateItem,
  onPressTimeItem,
  selectedDate,
  selectedDateIndex,
  selectedTimeIndex,
  selectedTime,
  times,
  actionId,
}: Props) => {
  const { addtocart, cartDetails } = useAppSelector((state) => state.cart);
  const [visible, setVisible] = useState(false);
  const [promptModal, setPromptModal] = useState(false);

  const getCart = async () => {
    let userInfo = await getAsyncUserInfo();
    let obj = {
      data: {
        userId: userInfo?.userId,
      },
      onSuccess: async (response: any) => {
        await setAsyncCartId(response?.data?.cart?.cart_id);
        dispatch({
          type: ADD_TO_CART,
          payload: response?.data?.cart,
        });
        dispatch({
          type: CART_DETAILS,
          payload: response?.data?.cart,
        });
        isInCart(data);
        timeCounter(data);
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
    let serviceId = "";
    addtocart?.offers?.forEach((item) => {
      item?.subServices?.forEach((service) => {
        if (item?.actionId == items?._id) {
          serviceId = service?._id;
        }
      });
    });

    let cartId = await getAsyncCartId();
    let userInfo = await getAsyncUserInfo();
    let passData = {
      userId: userInfo?.userId,
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

  const dispatch = useAppDispatch();

  const onPressAdd = async () => {
    if (
      Object?.keys(cartDetails)?.length == 0 ||
      cartDetails?.expertId?._id == data?.expert_id
    ) {
      setVisible(!visible);
    } else {
      setPromptModal(!promptModal);
    }
  };

  const isInCart = (item) => {
    return addtocart?.offers?.some(
      (items) =>
        items?.actionId == item?._id &&
        (cartDetails?.expertId?._id || cartDetails?.cart?.expertId?._id) ==
          actionId
    );
  };

  const onPressApply = async () => {
    let userInfo = await getAsyncUserInfo();
    let objs: any = {
      actionId: data?._id,
      serviceId: data?.sub_services?.service_id,
      serviceName: data?.offer_name,
      originalPrice: data?.sub_services?.price,
      discountedPrice: data?.sub_services?.discounted_price,
      quantity: 1,
      packageDetails: data?.additional_information,
      subServices: [
        {
          subServiceId: data?.sub_services?.sub_service_id,
          subServiceName: data?.sub_services?.sub_service_name,
          originalPrice: data?.sub_services?.price,
          discountedPrice: data?.sub_services?.discounted_price,
        },
      ],
    };
    let passData = {
      userId: userInfo?.userId,
      expertId: data?.expert_id,
      timeSlot: [
        {
          timeSlot_id: times[selectedTimeIndex]?._id,
          availableTime: times[selectedTimeIndex]?.time,
          availableDate: selectedDate,
        },
      ],
      services: [],
      packages: [],
      offers: [objs],
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
    dispatch(addToCart(obj));
  };

  const timeCounter = (item) => {
    return addtocart?.offers?.map(
      (items) =>
        items?.actionId == item?._id &&
        `${addtocart?.timeSlot?.[0]?.availableTime}, ${moment(
          addtocart?.timeSlot?.[0]?.availableDate
        )?.format("DD MMM, YYYY")}`
    );
  };

  const onPressYes = async () => {
    setPromptModal(!promptModal);
    let Ids = [];
    cartDetails?.services?.forEach((mainService) => {
      mainService?.subServices?.forEach((subService) => {
        Ids.push(subService?._id);
      });
    });
    cartDetails?.packages?.forEach((mainService) => {
      mainService?.subServices?.forEach((subService) => {
        Ids.push(subService?._id);
      });
    });
    cartDetails?.offers?.forEach((mainService) => {
      mainService?.subServices?.forEach((subService) => {
        Ids.push(subService?._id);
      });
    });
    let userInfo = await getAsyncUserInfo();
    let data = {
      cartId: cartDetails?.cart_id,
      userId: userInfo?.userId,
      itemIds: Ids,
    };
    let obj = {
      data: data,
      onSuccess: (response: any) => {
        dispatch({
          type: CART_DETAILS,
          payload: {},
        });
        dispatch({
          type: ADD_TO_CART,
          payload: [],
        });
      },
      onFailure: (Errr: any) => {
        console.log("Errr", Errr);
      },
    };
    dispatch(removeMultipleCartItems(obj));
  };

  return (
    <View style={styles.container}>
      <View style={styles.cloumStyle}>
        <Text style={styles.labelTextStyle}>{data?.offer_name}</Text>
        <View style={styles.rowStyle}>
          <Text style={styles.priceStyle}>
            {"₹ "}
            {data?.sub_services?.price}
          </Text>
        </View>
        <View style={{ flex: 1 }} />
        {isInCart(data) == false || isInCart(data) == undefined ? (
          <View style={styles.buttonBar}>
            <TouchableOpacity
              style={{ alignSelf: "flex-start" }}
              onPress={onPressAdd}
              disabled={
                isInCart(data) == false && addtocart?.offers?.length >= 1
                  ? true
                  : false
              }
            >
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
        DateItem_style={styles.dateStyle}
        scrollEnabled={false}
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
          uri: baseUrl + "/" + data?.sub_services?.fileName,
          priority: FastImage.priority.high,
        }}
      />
      <PromptModal
        onPressCancel={() => setPromptModal(!promptModal)}
        onPressYes={() => onPressYes()}
        isVisible={promptModal}
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
  selectedTime: {
    ...commonFontStyle(fontFamily.medium, 10, colors.grey_21),
    marginTop: hp(8),
  },
  dateStyle: {
    width: wp(50),
    height: hp(60),
  },
});

export default StylistInnerItem;
