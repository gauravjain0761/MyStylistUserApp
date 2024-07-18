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
  Alert,
  LogBox,
  TextStyle,
} from "react-native";
import {
  BackHeader,
  CongratulationModal,
  Loader,
  TimeSelector,
  UserItemLoader,
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
import {
  CarIcon,
  EditCartIcon,
  OfferIcon,
  OfferYellowIcon,
  PackagesIcon,
  StarIcon,
  TrashSqureIcon,
  VerifyIcon,
} from "../theme/SvgIcon";
import { images } from "../theme/icons";
import moment from "moment";
import { screenName } from "../helper/routeNames";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getExpertAvailability } from "../actions/commonActions";
import { getAsyncToken, getAsyncUserInfo } from "../helper/asyncStorage";
import { ADD_TO_CART, CART_DETAILS } from "../actions/dispatchTypes";
import {
  bookAppointment,
  getCartlist,
  removeMultipleCartItems,
} from "../actions";
import FastImage from "react-native-fast-image";
import { set } from "lodash";
import { err } from "react-native-svg";

type RowItemValueProps = {
  title: string;
  value: string;
  isShowClose?: boolean;
  onPressClose?: () => void;
  TitleStyle?: TextStyle;
};

const RowItemValue = ({
  title,
  value,
  isShowClose,
  onPressClose,
  TitleStyle,
}: RowItemValueProps) => {
  return (
    <View style={styles.rowSpaceStyle}>
      <Text style={[styles.greyTitleTextStyle, TitleStyle]}>{title}</Text>
      <View style={styles.rowItemStyle}>
        <Text style={styles.valueTextStyle}>{value}</Text>
        {isShowClose ? (
          <TouchableOpacity
            onPress={onPressClose}
            style={styles.closeContainer}
          >
            <TrashSqureIcon />
          </TouchableOpacity>
        ) : null}
      </View>
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
  const [selectedDateIndex, setSelectedDate] = useState(0);
  const [selectedTimeIndex, setSelectedTime] = useState(0);
  const [bookTime, setBookTime] = useState({});
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartEmpty, setCartEmpty] = useState(false);

  useEffect(() => {
    getCart();
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
        onSuccess: (response: any) => {
          let data = convertToOutput(response);
          let time = data[0].value;
          setDates(data);
          setDate(data[0]?.title);
          setTimes(data[0]?.value);
          setBookTime(time[0]);
        },
        onFailure: () => {},
      };
      dispatch(getExpertAvailability(obj));
    }
    getDatesList();
  }, []);

  const getCart = async () => {
    setCartLoading(true);
    let userInfo = await getAsyncUserInfo();
    let obj = {
      data: {
        userId: userInfo?._id,
      },
      onSuccess: (response: any) => {
        if (Object.values(response.data?.cart)?.length > 0) {
          dispatch({
            type: CART_DETAILS,
            payload: response?.data,
          });
        } else {
          setCartEmpty(true);
          dispatch({
            type: CART_DETAILS,
            payload: {},
          });
        }
        setCartLoading(false);
      },
      onFailure: (Errr: any) => {
        if (Errr?.data?.message === "Cart not found") {
          setCartEmpty(true);
          dispatch({
            type: CART_DETAILS,
            payload: {},
          });
        }
        setCartLoading(false);
      },
    };
    dispatch(getCartlist(obj));
  };

  const onPressDateItem = (index: any) => {
    setSelectedDate(index);
    setDate(dates[index].title);
    setTimes(dates[index].value);
    setSelectedTime(0);
  };

  const onPressTimeItem = (index: any) => {
    setSelectedTime(index);
    let bookDates = times[index];
    setBookTime(bookDates);
  };

  const onPressBook = async () => {
    setLoading(true);
    let Service = cartDetails?.cart?.services.flatMap((item, index) => {
      return item?.subServices?.flatMap((subService, index) => {
        return {
          service_id: subService?.subServiceId,
          service_name: subService?.subServiceName,
          price: subService?.originalPrice,
        };
      });
    });
    let Offer = cartDetails?.cart?.offers.flatMap((item, index) => {
      return item?.subServices?.flatMap((subService, index) => {
        return {
          service_id: subService?.subServiceId,
          service_name: subService?.subServiceName,
          price: subService?.originalPrice,
        };
      });
    });
    let Package = cartDetails?.cart?.packages.map((item, index) => {
      return {
        service_id: item?.serviceId,
        service_name: item?.serviceName,
        price: item?.price,
      };
    });
    const serviceTypes = [];
    const actions = cartDetails?.cart?.services?.map((item, index) => {
      serviceTypes.push("service");
      return {
        actionId: item?.actionId,
        serviceType: "service",
      };
    });
    let userInfo = await getAsyncUserInfo();
    let obj = {
      data: {
        bookingNumber: Math.floor(Math.random() * 9000000000) + 1000000000,
        userId: userInfo?._id,
        expertId: cartDetails?.cart?.expertId,
        customerName: cartDetails?.user?.name,
        services: [...Service],
        actions: actions,
        serviceType: [...new Set(serviceTypes)],
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
        setLoading(false);
        setTimeout(() => {
          setIsShowCongrestModal(true);
        }, 500);
      },
      onFailure: (Errr: any) => {
        console.log("Errr Errr", Errr);
        infoToast(Errr?.data?.error);
        setLoading(false);
      },
    };
    dispatch(bookAppointment(obj));
  };

  const onPressCard = () => {
    navigate(screenName.YourStylist);
  };

  const onPressRemoveSignalItem = async (item: any, type: string) => {
    let userInfo = await getAsyncUserInfo();
    let itemIdes: any = [];
    if (type == "Service") {
      itemIdes.push(item?._id);
    } else if (type == "Package") {
      item?.subServices?.forEach((service) => {
        itemIdes.push(service?._id);
      });
    } else if (type == "Offer") {
      item?.subServices?.forEach((service) => {
        itemIdes.push(service?._id);
      });
    }
    let data = {
      userId: userInfo?._id,
      itemIds: itemIdes,
      cartId: cartDetails?.cart?.cart_id,
    };
    let obj = {
      data: data,
      onSuccess: () => {
        getCart();
      },
      onFailure: () => {},
    };
    dispatch(removeMultipleCartItems(obj));
  };

  const RemoveItems = async () => {
    let Ids = [];
    cartDetails?.cart?.services?.forEach((mainService) => {
      mainService?.subServices?.forEach((subService) => {
        Ids.push(subService?._id);
      });
    });
    cartDetails?.cart?.packages?.forEach((mainService) => {
      mainService?.subServices?.forEach((subService) => {
        Ids.push(subService?._id);
      });
    });
    cartDetails?.cart?.offers?.forEach((mainService) => {
      mainService?.subServices?.forEach((subService) => {
        Ids.push(subService?._id);
      });
    });
    let userInfo = await getAsyncUserInfo();
    let data = {
      cartId: cartDetails?.cart?.cart_id,
      userId: userInfo?._id,
      itemIds: Ids,
    };
    let obj = {
      data: data,
      onSuccess: (response: any) => {
        setLoading(false);
        dispatch({
          type: CART_DETAILS,
          payload: {},
        });
        dispatch({
          type: ADD_TO_CART,
          payload: [],
        });
        setCartEmpty(true);
      },
      onFailure: (Errr: any) => {
        console.log("Errr", Errr);
        setLoading(false);
      },
    };
    dispatch(removeMultipleCartItems(obj));
  };

  const onPressDeleteCart = () => {
    Alert.alert("Delete Cart", "Are you sure you want delete your cart?.", [
      {
        text: "No",
        onPress: () => console.log("Cancel Pressed"),
      },
      {
        text: "Yes",
        onPress: () => RemoveItems(),
        style: "destructive",
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <BackHeader
        isDelete
        title={strings["Cart"]}
        onPressDelete={onPressDeleteCart}
        onPressScreenBack={() => navigate(screenName.Home)}
      />
      <Loader visible={loading} />
      {cartEmpty ? (
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
            {cartLoading ? (
              <View style={{ ...styles.whiteContainer, paddingTop: 0 }}>
                <UserItemLoader />
              </View>
            ) : (
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
                      <Text numberOfLines={1} style={styles.nameTextStyle}>
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
            )}
            <View style={styles.orderContainer}>
              {cartLoading ? null : (
                <>
                  {cartDetails?.cart?.services?.length > 0 && (
                    <>
                      <FlatList
                        data={cartDetails?.cart?.services}
                        renderItem={({ item, index }) => {
                          return (
                            <FlatList
                              data={item?.subServices}
                              renderItem={({ item: data, index }) => {
                                return (
                                  <RowItemValue
                                    title={data?.subServiceName}
                                    isShowClose={true}
                                    value={"₹" + data?.originalPrice}
                                    onPressClose={() =>
                                      onPressRemoveSignalItem(data, "Service")
                                    }
                                  />
                                );
                              }}
                            />
                          );
                        }}
                        keyExtractor={(item, index) => index.toString()}
                      />
                      <View style={styles.timeContainer}>
                        <Text style={styles.timeTitle}>
                          {moment(
                            cartDetails?.cart?.services?.[0]?.timeSlot
                          )?.format("hh:mm:A, DD MMM, YYYY")}
                        </Text>
                        <TouchableOpacity style={styles.changebtn}>
                          <Image
                            source={images.editIcon}
                            resizeMode="contain"
                            style={styles.editIcon}
                          />
                          <Text style={styles.btnTitle}>{"Change"}</Text>
                        </TouchableOpacity>
                      </View>
                      <Image
                        resizeMode="stretch"
                        style={styles.cardline}
                        source={images.dashline}
                      />
                    </>
                  )}
                  {cartDetails?.cart?.packages?.length > 0 && (
                    <>
                      <FlatList
                        data={cartDetails?.cart?.packages}
                        ItemSeparatorComponent={() => (
                          <View style={{ height: hp(23) }}></View>
                        )}
                        renderItem={({ item, index }) => {
                          return (
                            <View style={styles.packageCard}>
                              <View style={styles.packageLabelContainer}>
                                <PackagesIcon />
                                <Text style={styles?.packageLabel}>
                                  {"PACKAGE"}
                                </Text>
                              </View>
                              <View style={styles.topContainer}>
                                <Text style={styles.packageTitle}>
                                  {item?.packageName}
                                </Text>
                                <View style={styles.rightContainer}>
                                  <Text style={styles?.valueTextStyle}>
                                    {`₹ ${item?.packageTotal}`}
                                  </Text>
                                  <TouchableOpacity
                                    onPress={() =>
                                      onPressRemoveSignalItem(item, "Package")
                                    }
                                    style={styles.closeContainer}
                                  >
                                    <TrashSqureIcon />
                                  </TouchableOpacity>
                                </View>
                              </View>
                              <FlatList
                                data={item?.subServices}
                                renderItem={({ item: data, index }) => {
                                  return (
                                    <View
                                      style={{
                                        ...styles.rowStyle,
                                        paddingTop: hp(10),
                                      }}
                                    >
                                      <View
                                        style={{
                                          ...styles.dotStyle,
                                          backgroundColor: colors?.black,
                                          marginHorizontal: 0,
                                          marginRight: wp(10),
                                        }}
                                      />
                                      <Text style={styles.boldTextStyle}>
                                        {data?.subServiceName}:{" "}
                                        <Text
                                          style={styles.greyTextStyle}
                                        ></Text>
                                      </Text>
                                    </View>
                                  );
                                }}
                              />
                            </View>
                          );
                        }}
                        keyExtractor={(item, index) => index.toString()}
                      />
                      <View style={styles.timeContainer}>
                        <Text style={styles.timeTitle}>
                          {moment(
                            cartDetails?.cart?.packages?.[0]?.timeSlot
                          )?.format("hh:mm:A, DD MMM, YYYY")}
                        </Text>
                        <TouchableOpacity style={styles.changebtn}>
                          <Image
                            source={images.editIcon}
                            resizeMode="contain"
                            style={styles.editIcon}
                          />
                          <Text style={styles.btnTitle}>{"Change"}</Text>
                        </TouchableOpacity>
                      </View>
                      <Image
                        resizeMode="stretch"
                        style={styles.cardline}
                        source={images.dashline}
                      />
                    </>
                  )}
                  {cartDetails?.cart?.offers?.length > 0 && (
                    <>
                      <FlatList
                        data={cartDetails?.cart?.offers}
                        ItemSeparatorComponent={() => (
                          <View style={{ height: hp(23) }}></View>
                        )}
                        renderItem={({ item, index }) => {
                          return (
                            <View style={styles.offerCard}>
                              <View style={styles.packageLabelContainer}>
                                <Image
                                  resizeMode="contain"
                                  style={styles?.offerImage}
                                  source={images.yellowOffer}
                                />
                                <Text style={styles?.packageLabel}>
                                  {"OFFER"}
                                </Text>
                              </View>
                              <View style={styles.topContainer}>
                                <Text style={styles?.offerTitle}>
                                  {item?.offerName}
                                </Text>
                                <View style={styles.topRight}>
                                  <Text
                                    style={styles.valueTextStyle}
                                  >{`₹ ${item?.offerTotal}`}</Text>
                                  <TouchableOpacity
                                    onPress={() =>
                                      onPressRemoveSignalItem(item, "Offer")
                                    }
                                    style={styles.closeContainer}
                                  >
                                    <TrashSqureIcon />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                          );
                        }}
                        keyExtractor={(item, index) => index.toString()}
                      />
                      <View style={styles.timeContainer}>
                        <Text style={styles.timeTitle}>
                          {moment(
                            cartDetails?.cart?.offers?.[0]?.timeSlot
                          )?.format("hh:mm:A, DD MMM, YYYY")}
                        </Text>
                        <TouchableOpacity style={styles.changebtn}>
                          <Image
                            source={images.editIcon}
                            resizeMode="contain"
                            style={styles.editIcon}
                          />
                          <Text style={styles.btnTitle}>{"Change"}</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </>
              )}
            </View>
            <View style={styles.cardbg}>
              <View style={styles?.topComponent}>
                <Text style={styles.titleStyle}>{"Payment Details"}</Text>
                <RowItemValue
                  title="Tax"
                  value={cartDetails?.cart?.tax?.toFixed(2)}
                />
                <RowItemValue title="Payment Method" value="Cash" />
                <View style={styles.TotalrowSpaceStyle}>
                  <Text style={styles.valueTextStyle}>{"Total (INR)"}</Text>
                  <Text style={styles.valueTextStyle}>
                    {"₹"}
                    {cartDetails?.cart?.totalPrice}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View style={styles.subtract_left}></View>
                <Image
                  resizeMode="stretch"
                  style={styles.cardlineStyle}
                  source={images.dashline}
                />
                <View style={styles.subtract_right}></View>
              </View>
              <View style={styles.bottomPart}>
                <Text style={styles.saveTitle}>
                  {"🎉 You saved ₹1000 on this order"}
                </Text>
              </View>
            </View>
            <CongratulationModal
              isVisible={isShowCongrestModal}
              onPressHome={() => {
                setIsShowCongrestModal(false);
                setTimeout(() => {
                  RemoveItems();
                  dispatchNavigation(screenName.Home);
                }, 500);
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
    backgroundColor: "#F3F3F3",
  },
  whiteContainer: {
    margin: 20,
    borderRadius: wp(10),
    padding: wp(13),
    backgroundColor: colors.white,
  },
  rowStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  personStyle: {
    height: hp(111),
    width: wp(100),
    borderRadius: wp(10),
  },
  nameTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 30, colors.black),
    marginRight: wp(5),
    maxWidth: wp(170),
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
    height: wp(4),
    width: wp(4),
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
    paddingTop: hp(23),
  },
  rowSpaceStyle: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: hp(10),
    justifyContent: "space-between",
  },
  rowItemStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  greyTitleTextStyle: {
    ...commonFontStyle(fontFamily.regular, 16, colors.gery_6),
  },
  valueTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 16, colors.grey_22),
  },
  closeContainer: {
    marginLeft: wp(10),
    ...commonFontStyle(fontFamily.semi_bold, 20, colors.black),
  },
  cardlineStyle: {
    width: "90%",
    tintColor: colors.green_3,
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
  cardbg: {
    backgroundColor: colors.white,
    margin: wp(20),
    borderRadius: wp(10),
    overflow: "hidden",
  },
  topComponent: {
    paddingHorizontal: wp(20),
  },
  bottomPart: {
    paddingHorizontal: wp(20),
    backgroundColor: colors.primary_light_blue_4,
  },
  saveTitle: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors?.green_5),
    paddingVertical: hp(12),
    alignSelf: "center",
  },
  subtract_left: {
    width: wp(16),
    height: wp(16),
    backgroundColor: "#F3F3F3",
    borderRadius: wp(50),
    position: "absolute",
    left: wp(-8),
    bottom: hp(-8),
    zIndex: 1,
  },
  subtract_right: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(50),
    position: "absolute",
    right: wp(-8),
    bottom: hp(-8),
    backgroundColor: "#F3F3F3",
    zIndex: 1,
  },
  TotalrowSpaceStyle: {
    paddingTop: hp(16),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: hp(20),
    borderTopWidth: 1,
    borderColor: colors.gery_7,
    marginTop: hp(18),
  },
  offerCard: {},
  timeContainer: {
    marginTop: hp(13),
    backgroundColor: colors?.primary_light_blue_4,
    borderRadius: wp(5),
    paddingVertical: hp(5),
    paddingHorizontal: wp(16),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeTitle: {
    ...commonFontStyle(fontFamily.semi_bold, 15, colors?.green_5),
  },
  changebtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(6),
  },
  btnTitle: {
    ...commonFontStyle(fontFamily.semi_bold, 14, colors?.green_5),
  },
  editIcon: {
    width: wp(18),
    height: wp(18),
  },
  cardline: {
    alignSelf: "center",
    width: "100%",
    marginTop: hp(28),
    marginBottom: hp(20),
  },
  packageCard: {},
  packageLabel: {
    ...commonFontStyle(fontFamily.medium, 10, colors.black),
  },
  packageLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(4),
    marginBottom: hp(6),
  },
  leftContainer: {},
  packageTitle: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black),
    lineHeight: hp(22),
  },
  packageContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  rightContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  boldTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 12, colors.black),
  },
  offerImage: {
    width: wp(13),
    height: wp(13),
  },
  offerTitle: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black),
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
  },
  topRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderContainer: {
    backgroundColor: colors.white,
    margin: wp(20),
    borderRadius: wp(10),
    overflow: "hidden",
    paddingHorizontal: wp(20),
    paddingVertical: hp(20),
  },
});

export default Cart;
