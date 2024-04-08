import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  FlatList,
} from "react-native";
import {
  BackHeader,
  CongratulationModal,
  Loader,
  TimeSelector,
  WeekDateSelector,
} from "../components";
import { strings } from "../helper/string";
import {
  convertToOutput,
  dispatchNavigation,
  generateTimes,
  generateWeekDates,
  hp,
  infoToast,
  wp,
} from "../helper/globalFunction";
import { colors } from "../theme/color";
import { commonFontStyle, fontFamily } from "../theme/fonts";
import { CarIcon, StarIcon, VerifyIcon } from "../theme/SvgIcon";
import { images } from "../theme/icons";
import moment from "moment";
import { screenName } from "../helper/routeNames";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getExpertAvailability } from "../actions/commonActions";
import { getAsyncToken, getAsyncUserInfo } from "../helper/asyncStorage";
import { CART_DETAILS } from "../actions/dispatchTypes";
import {
  bookAppointment,
  getCartlist,
  removeMultipleCartItems,
} from "../actions";
import FastImage from "react-native-fast-image";

type RowItemValueProps = {
  title: string;
  value: string;
};

const RowItemValue = ({ title, value }: RowItemValueProps) => {
  return (
    <View style={styles.rowSpaceStyle}>
      <Text style={styles.greyTitleTextStyle}>{title}</Text>
      <Text style={styles.valueTextStyle}>{value}</Text>
    </View>
  );
};

const Cart = () => {
  const dispatch = useAppDispatch();
  const { cartDetails, addtocart } = useAppSelector((state) => state.cart);
  const [dates, setDates] = useState([]);
  const [times, setTimes] = useState([]);
  const [isShowCongrestModal, setIsShowCongrestModal] = useState(false);
  const { navigate } = useNavigation();
  const [selectedDateIndex, setSelectedDate] = useState(null);
  const [selectedTimeIndex, setSelectedTime] = useState(null);
  const [bookTime, setBookTime] = useState({});
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCart();
    async function getDatesList() {
      let userInfo = await getAsyncUserInfo();
      let data = generateWeekDates();

      let obj = {
        data: {
          startDate: moment(data?.[0].date).format("YYYY-MM-DD"),
          endDate: moment(data?.[data?.length - 1].date).format("YYYY-MM-DD"),
          timeSlotDuration: 60,
          expertId: userInfo._id,
        },
        onSuccess: (response: any) => {
          setDates(convertToOutput(response));
        },
        onFailure: () => {},
      };
      dispatch(getExpertAvailability(obj));
    }
    getDatesList();
  }, []);

  const getCart = async () => {
    let userInfo = await getAsyncUserInfo();
    let obj = {
      data: {
        userId: userInfo._id,
      },
      onSuccess: (response: any) => {
        let initialvalue = 0;
        let total = response.data?.cart?.items?.reduce(
          (accumulator, curruntvalue) => curruntvalue.price + accumulator,
          initialvalue
        );
        dispatch({
          type: CART_DETAILS,
          payload: { ...response?.data, total: total },
        });
      },
      onFailure: (Errr: any) => {
        alert(Errr?.data?.message);
        data = ["0"];
      },
    };
    dispatch(getCartlist(obj));
  };

  const onPressDateItem = (index: any) => {
    setSelectedDate(index);
    setDate(dates[index].title);
    setTimes(dates[index].value);
    setSelectedTime(null);
  };

  const onPressTimeItem = (index: any) => {
    setSelectedTime(index);
    let bookDates = times[index];
    setBookTime(bookDates);
  };

  let data = ["1"];

  const onPressBook = useCallback(async () => {
    if (selectedDateIndex === null) {
      infoToast("Please select a date");
    } else if (selectedTimeIndex === null) {
      infoToast("Please select a time");
    } else {
      setLoading(true);
      let newobj = cartDetails?.cart?.items.map((item, index) => {
        return {
          service_id: item?.serviceId,
          service_name: item?.serviceName,
          price: item?.price,
        };
      });

      let userInfo = await getAsyncUserInfo();
      let obj = {
        data: {
          bookingNumber: Math.floor(Math.random() * 9000000000) + 1000000000,
          userId: userInfo?._id,
          expertId: cartDetails?.cart?.expertId,
          customerName: cartDetails?.user?.name,
          services: newobj,
          timeSlot: [
            {
              timeSlot_id: bookTime?._id,
              availableDate: date,
              availableTime: bookTime?.time,
            },
          ],
          paymentType: "COD",
          notes: "Special requests or notes for the appointment",
        },
        onSuccess: (response: any) => {
          RemoveItems();
        },
        onFailure: (Errr: any) => {
          infoToast(Errr?.data?.error);
          setLoading(false);
        },
      };
      dispatch(bookAppointment(obj));
    }
  }, [bookTime, selectedDateIndex, selectedTimeIndex]);

  const onPressCard = () => {
    navigate(screenName.YourStylist);
  };

  const RemoveItems = async () => {
    let Ids = addtocart.items.map((items) => items?._id);
    let userInfo = await getAsyncUserInfo();
    let obj = {
      data: {
        cartId: cartDetails?.cart?._id,
        userId: userInfo?._id,
        itemIds: Ids,
      },
      onSuccess: (response: any) => {
        setIsShowCongrestModal(true);
        setLoading(false);
      },
      onFailure: (Errr: any) => {
        setLoading(false);
      },
    };
    dispatch(removeMultipleCartItems(obj));
  };

  return (
    <View style={styles.container}>
      <BackHeader title={strings["Cart"]} />
      <Loader visible={loading} />
      {cartDetails?.cart?.items?.length === 0 ? (
        <View style={styles.centerContainer}>
          <Image
            resizeMode="contain"
            source={images.cart}
            style={styles.cartIconStyle}
          />
          <Text style={styles.cartTextStyle}>
            {strings["Your cart is empty"]}
          </Text>
          <Text style={styles.greyCartTextStyle}>
            {
              strings[
                "Looks like you have not added anything to you cart.Go ahead & explore top categories."
              ]
            }
          </Text>
        </View>
      ) : (
        <>
          <ScrollView style={{ flex: 1 }}>
            <View style={styles.whiteContainer}>
              <View style={styles.rowStyle}>
                <FastImage
                  style={styles.personStyle}
                  source={{
                    uri:
                      cartDetails?.featured_image_url +
                      "/" +
                      cartDetails?.user?.user_profile_images[0]?.image,
                    priority: FastImage.priority.high,
                  }}
                />
                <TouchableOpacity
                  onPress={onPressCard}
                  style={styles.columStyle}
                >
                  <View style={styles.rowNameStyle}>
                    <Text style={styles.nameTextStyle}>
                      {cartDetails?.user?.name}
                    </Text>
                    <VerifyIcon />
                  </View>
                  <View
                    style={{ ...styles.rowNameStyle, marginVertical: hp(10) }}
                  >
                    <View style={styles.startContainer}>
                      <Text style={styles.startTextStyle}>
                        {cartDetails?.user?.averageRating}
                      </Text>
                      <StarIcon />
                    </View>
                    <View style={styles.dotStyle} />
                    <Text style={styles.greyTextStyle}>
                      {cartDetails?.user?.jobDone}
                      {" Jobs Done"}
                    </Text>
                  </View>
                  <View style={styles.rowNameStyle}>
                    <CarIcon />
                    <Text style={styles.locationTextStyle}>
                      {cartDetails?.user?.city[0]?.city_name}
                      {","}
                      {cartDetails?.user?.district[0]?.district_name}
                      {","}
                      {cartDetails?.user?.state[0]?.state_name}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ ...styles.whiteContainer, marginTop: 0 }}>
              <Text style={styles.titleStyle}>{strings["Bill Details"]}</Text>
              <FlatList
                data={cartDetails?.cart?.items}
                renderItem={({ item }) => {
                  return (
                    <RowItemValue
                      title={item?.serviceName}
                      value={"₹" + item?.price}
                    />
                  );
                }}
              />
              <RowItemValue title="Payment Method" value="Cash" />
              <View style={styles.lineStyle} />
              <View style={styles.rowSpaceStyle}>
                <Text style={styles.valueTextStyle}>{"Total (INR)"}</Text>
                <Text style={styles.valueTextStyle}>
                  {"₹"}
                  {cartDetails?.total}
                </Text>
              </View>
            </View>
            <View style={{ ...styles.whiteContainer, marginTop: 0 }}>
              <Text style={styles.titleStyle}>{strings["Select Date"]}</Text>
              <WeekDateSelector
                list={dates}
                selectIndex={selectedDateIndex}
                onPressDate={(index) => onPressDateItem(index)}
              />
            </View>
            <View style={{ ...styles.whiteContainer, marginTop: 0 }}>
              <Text style={styles.titleStyle}>{strings["Select Time"]}</Text>
              <TimeSelector
                data={times}
                onPressTime={(index) => onPressTimeItem(index)}
                selectIndex={selectedTimeIndex}
              />
            </View>
            <CongratulationModal
              isVisible={isShowCongrestModal}
              onPressHome={() => {
                setIsShowCongrestModal(false);
                dispatchNavigation(screenName.Home);
              }}
            />
          </ScrollView>
          <View style={styles.bottomStyle}>
            <TouchableOpacity onPress={onPressBook}>
              <ImageBackground
                resizeMode="contain"
                style={styles.bookImgStyle}
                source={images.book_button}
              >
                <Text style={styles.bookTextStyle}>
                  {strings["Book  Appointment"]}
                </Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  whiteContainer: {
    margin: 20,
    borderRadius: 8,
    padding: wp(13),
    backgroundColor: colors.white,
  },
  rowStyle: {
    flexDirection: "row",
  },
  personStyle: {
    height: hp(111),
    width: wp(100),
    borderRadius: wp(10),
  },
  nameTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 30, colors.black),
    marginRight: wp(5),
  },
  columStyle: {
    marginLeft: wp(15),
  },
  rowNameStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  startContainer: {
    backgroundColor: colors.green_1,
    borderRadius: 6,
    padding: wp(2),
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
  },
  startTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 12, colors.white),
    marginRight: wp(2),
  },
  dotStyle: {
    height: 4,
    width: 4,
    borderRadius: 4,
    marginHorizontal: wp(10),
    backgroundColor: colors.gery_2,
  },
  greyTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 14, colors.gery_2),
  },
  locationTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 14, colors.gery_2),
    marginHorizontal: wp(5),
  },
  titleStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black),
    marginBottom: hp(10),
  },
  rowSpaceStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: hp(10),
  },
  greyTitleTextStyle: {
    ...commonFontStyle(fontFamily.regular, 16, colors.gery_6),
  },
  valueTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 16, colors.black),
  },
  lineStyle: {
    borderBottomWidth: 1,
    borderColor: colors.gery_7,
    marginVertical: hp(10),
  },
  bottomStyle: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    backgroundColor: colors.white,
    padding: wp(20),
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: hp(25),
  },
  bookImgStyle: {
    justifyContent: "center",
    alignItems: "center",
    height: hp(63),
    width: wp(334),
  },
  bookTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black),
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cartIconStyle: {
    height: wp(150),
    width: wp(150),
    alignSelf: "center",
    marginLeft: -wp(30),
    marginBottom: hp(10),
  },
  cartTextStyle: {
    ...commonFontStyle(fontFamily.bold, 20, colors.black),
    marginTop: hp(20),
    textAlign: "center",
  },
  greyCartTextStyle: {
    ...commonFontStyle(fontFamily.regular, 14, colors.gery_8),
    textAlign: "center",
    marginHorizontal: wp(20),
    marginVertical: hp(20),
  },
});

export default Cart;
