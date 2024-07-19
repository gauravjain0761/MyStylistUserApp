import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  ImageBackground,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  convertToOutput,
  generateWeekDates,
  hp,
  infoToast,
  wp,
} from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { ArrowUp, TimingIcon, TrashIcon } from "../../theme/SvgIcon";
import { SelectDateModal, ServiceInnerItem, StylistInnerItem } from "..";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  getAsyncCartId,
  getAsyncUserInfo,
  setAsyncCartId,
} from "../../helper/asyncStorage";
import {
  addToCart,
  getCartlist,
  getMainServices,
  removeMultipleCartItems,
} from "../../actions";
import {
  ADD_TO_CART,
  CART_DETAILS,
  SELECTED_SERVICE,
  SELECTED_TIME_SLOT,
  TIME_SLOT,
} from "../../actions/dispatchTypes";
import {
  useFocusEffect,
  useIsFocused,
  useRoute,
} from "@react-navigation/native";
import moment from "moment";
import { getExpertAvailability } from "../../actions/commonActions";
import FastImage from "react-native-fast-image";
import { images } from "../../theme/icons";
import { strings } from "../../helper/string";

type Props = {
  data: any;
  service: any;
  index: number;
  type?: string;
  baseUrl: string;
  actionId: string;
};

const ServiceItem = ({ data, service, index, baseUrl, actionId }: Props) => {
  const [expanded, setExpanded] = useState({});
  const [bookTime, setBookTime] = useState("");
  const [date, setDate] = useState("");
  const [selectedDateIndex, setSelectedDate] = useState(0);
  const [selectedTimeIndex, setSelectedTime] = useState(0);
  const [dates, setDates] = useState([]);
  const [times, setTimes] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectService, setSelectService] = useState({});
  const { params } = useRoute();
  const expertId = params?.id || "";
  const { addtocart, selectedService } = useAppSelector((state) => state.cart);
  const { mainService } = useAppSelector((state) => state.home);
  const { timeSlot } = useAppSelector((state) => state?.home);
  const [services, setServices] = useState([]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    setServices(mainService);
    if (Object?.values(expanded)?.length == 0 && mainService?.length) {
      setExpanded({ [mainService[0]?.service_name]: true });
    }
  }, [mainService]);

  useEffect(() => {
    async function getDatesList() {
      let userInfo = await getAsyncUserInfo();
      let data = generateWeekDates();

      let obj = {
        data: {
          startDate: moment(data?.[0]?.date).format("YYYY-MM-DD"),
          endDate: moment(data?.[data?.length - 1]?.date).format("YYYY-MM-DD"),
          timeSlotDuration: 60,
          expertId: userInfo?._id,
        },
        onSuccess: async (response: any) => {
          let data = await convertToOutput(response);
          let time = data?.[0]?.value;
          setDates(data);
          let indexes = await time
            ?.map((time: any, index: number) =>
              time?.isPast == false ? index : null
            )
            ?.filter((item) => item);
          setSelectedTime(indexes[0]);
          setDate(data[0]?.title);
          setTimes(data[0]?.value);
          setBookTime(time[indexes[0]]);
        },
        onFailure: () => {},
      };
      dispatch(getExpertAvailability(obj));
    }
    getMainService();
    getDatesList();
    getCart();
  }, []);

  const getMainService = async () => {
    let obj = {
      onSuccess: () => {},
      onFailure: (Err) => {
        console.log("Errr in Offer", Err);
      },
    };
    dispatch(getMainServices(obj));
  };

  useEffect(() => {
    if (selectedService?.length) {
      if (timeSlot?.length == 0) {
        setTimeout(() => {
          setVisible(!visible);
        }, 800);
      } else {
        onPressApply();
      }
    }
  }, []);

  const getCart = async () => {
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

  const onPressApply = async () => {
    let userInfo = await getAsyncUserInfo();
    let selectedData = selectedService?.flatMap((datas) => {
      let selcted = service
        ?.flatMap((item) => {
          if (item?.sub_service_id?._id == datas?._id) {
            return {
              actionId: datas?.service_id,
              serviceId: datas?.service_id,
              serviceName: datas?.service_name,
              quantity: 1,
              packageDetails: null,
              subServices: [
                {
                  subServiceId: datas?._id,
                  subServiceName: datas?.sub_service_name,
                  originalPrice: item?.price,
                  discountedPrice: 0,
                },
              ],
            };
          }
        })
        ?.filter((service) => service);
      return selcted;
    });
    let customSelect = {
      actionId: selectService?.service_id?._id,
      serviceId: selectService?.service_id?._id,
      serviceName: selectService?.service_id?.service_name,
      quantity: 1,
      packageDetails: null,
      subServices: [
        {
          subServiceId: selectService?.sub_service_id?._id,
          subServiceName: selectService?.sub_service_id?.sub_service_name,
          originalPrice: selectService?.price,
          discountedPrice: 0,
        },
      ],
    };
    let passData = {
      userId: userInfo?._id,
      expertId: expertId || actionId,
      timeSlot: [
        {
          timeSlot_id: times[selectedTimeIndex]?._id,
          availableTime: times[selectedTimeIndex]?.time,
          availableDate: date,
        },
      ],
      services: Object?.values(selectService)?.length
        ? [customSelect]
        : selectedData,
      packages: [],
      offers: [],
    };
    dispatch({
      type: SELECTED_TIME_SLOT,
      payload: {
        timeSlot_id: times[selectedTimeIndex]?._id,
        availableTime: times[selectedTimeIndex]?.time,
        availableDate: date,
        expertId: expertId || actionId,
      },
    });
    let obj = {
      data: passData,
      onSuccess: async (response: any) => {
        await getCart();
        infoToast("Service added successfully");
        dispatch({ type: SELECTED_SERVICE, payload: [] });
        dispatch({ type: TIME_SLOT, payload: "" });
      },
      onFailure: (Err: any) => {
        console.log("ServiceInner Err", Err);
      },
    };
    dispatch(addToCart(obj));
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

  const onPressDateItem = (index: any) => {
    setSelectedDate(index);
    setDate(dates[index]?.title);
    setTimes(dates[index]?.value);
    setSelectedTime(0);
  };

  const onPressTimeItem = (index: any) => {
    setSelectedTime(index);
    let bookDates = times[index];
    setBookTime(bookDates);
  };

  const onPressArrow = (item) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    setExpanded((prevExpandedItems) => ({
      ...prevExpandedItems,
      [item.service_name]: !prevExpandedItems[item.service_name],
    }));
  };

  const onPressAddService = (item) => {
    setSelectService(item);
    setVisible(!visible);
  };

  return (
    <View key={index}>
      <FlatList
        data={services}
        renderItem={({ item: items, index }) => {
          const isExpanded = expanded[items?.service_name];
          return (
            <>
              <TouchableOpacity
                onPress={() => onPressArrow(items)}
                style={styles.headerRowStyle}
              >
                <Text style={styles.titleTextStyle}>{items?.service_name}</Text>
                <View
                  style={{
                    transform: [{ rotate: isExpanded ? "0deg" : "180deg" }],
                  }}
                >
                  <ArrowUp />
                </View>
              </TouchableOpacity>
              {isExpanded ? (
                <FlatList
                  data={service}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => {
                    return items?.service_name ==
                      item?.service_id?.service_name ? (
                      <ServiceInnerItem
                        data={item}
                        key={index}
                        baseUrl={baseUrl}
                        actionId={actionId}
                        index={index}
                        onPressApply={(item) => onPressAddService(item)}
                        onPressDelete={(item) => onPressDelete(item)}
                      />
                    ) : null;
                  }}
                />
              ) : null}
            </>
          );
        }}
      />
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
        onPressApply={() => onPressApply()}
      />
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
  dateStyle: {
    width: wp(50),
    height: hp(60),
  },
});

export default ServiceItem;
