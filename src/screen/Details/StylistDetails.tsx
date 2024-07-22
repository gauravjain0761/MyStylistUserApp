import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  convertStringToTitle,
  formatData,
  formatWorkingHours,
  getAmenitiesIcon,
  hp,
  screen_width,
  wp,
} from "../../helper/globalFunction";
import { useNavigation, useRoute } from "@react-navigation/native";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";
import {
  Modals,
  OfferLoader,
  PackagesItem,
  StylistItem,
  UserItemLoader,
} from "../../components";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import FastImage from "react-native-fast-image";
import {
  BackIcon,
  CarIcon,
  OfferIcon,
  OfferYellowIcon,
  StarIcon,
  VerifyIcon,
} from "../../theme/SvgIcon";
import LinearGradient from "react-native-linear-gradient";
import { images } from "../../theme/icons";
import { strings } from "../../helper/string";
import MyWorkItem from "../../components/Details/MyWorkItem";
import TagView from "../../components/Details/TagView";
import {
  getAllOffersByUser,
  getAllPackageByUser,
  getCartlist,
  getUserItemDetails,
  getUsersFavList,
} from "../../actions";
import { getAsyncUserInfo } from "../../helper/asyncStorage";
import { ADD_TO_CART, CART_DETAILS } from "../../actions/dispatchTypes";
import ReviewModel from "../../components/Details/ReviewModal";
import { SafeAreaView } from "react-native-safe-area-context";

const StylistDetails = () => {
  const { params }: any = useRoute();
  const { cartDetails, addtocart } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const { navigate, goBack } = useNavigation();
  const { itemDetails } = useAppSelector((state) => state.home);
  const { userOfferList } = useAppSelector((state) => state.offers);
  const { userPackageList } = useAppSelector((state) => state.package);
  const [isOffers, setIsOffers] = useState(true);
  const [isPackages, setIsPackages] = useState(false);
  const [isMyWork, setIsMyWork] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [total, setTotal] = useState(0);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const animated = useSharedValue(0);
  const [animatedValue, setAnimatedValue] = useState(0);
  const [like, setLike] = useState(false);
  const [likeID, setLikeID] = useState("");
  const [loading, setLoading] = useState(true);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width:
        animated.value === 1
          ? withTiming(275, { duration: 500 })
          : withTiming(0, { duration: 500 }),
    };
  });

  const getDetails = () => {
    setLoading(true);
    let userid = params?.id;
    let obj = {
      isLoading: true,
      data: {
        userid: userid,
      },
      onSuccess: () => {
        setLoading(false);
        getFavUser();
      },
      onFailure: () => {
        setLoading(false);
      },
    };
    dispatch(getUserItemDetails(obj));
  };

  useEffect(() => {
    if (Platform.OS === "android") {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
    getDetails();
    if (params?.isPackages) {
      setIsOffers(false);
      setIsPackages(true);
      setIsMyWork(false);
    }
  }, []);

  useEffect(() => {
    if (addtocart.length > 0 || Object.keys(addtocart).length > 0) {
      Calculate();
    }
  }, [addtocart]);

  const getFavUser = async () => {
    let userInfo = await getAsyncUserInfo();
    let obj = {
      data: {
        userId: userInfo?._id,
      },
      onSuccess: (response: any) => {
        getCart();
        response?.data.map((item) => {
          if (item._id == itemDetails?.user._id) {
            setLikeID(item?.favouriteId);
            setLike(true);
          } else {
            setLike(false);
          }
        });
        setLoading(false);
      },
      onFailure: (Errr: any) => {
        console.log("Errr", Errr);
      },
    };
    dispatch(getUsersFavList(obj));
  };

  const getCart = async () => {
    let userInfo = await getAsyncUserInfo();

    let obj = {
      data: {
        userId: userInfo._id,
      },
      onSuccess: async (response: any) => {
        dispatch({ type: CART_DETAILS, payload: response?.data });
        let initialvalue = 0;
        let total = response?.data?.cart?.items.reduce(
          (acc, item) => acc + item?.price,
          initialvalue
        );
        setTotal(total);
      },
      onFailure: (Errr: any) => {
        console.log("Errr", Errr);
      },
    };
    dispatch(getCartlist(obj));
  };

  const Calculate = useCallback(() => {
    let initialvalue = 0;
    let total = addtocart?.items.reduce(
      (acc, item) => acc + item?.price,
      initialvalue
    );
    setTotal(total);
  }, [addtocart]);

  useEffect(() => {
    let obj = {
      id: itemDetails?.user?._id,
    };
    dispatch(getAllOffersByUser(obj));
    dispatch(getAllPackageByUser(obj));
  }, [itemDetails]);

  const onPressOffers = () => {
    setIsOffers(true);
    setIsPackages(false);
    setIsMyWork(false);
  };

  const onPressPackages = () => {
    setIsOffers(false);
    setIsPackages(true);
    setIsMyWork(false);
  };

  const onPressMyWork = () => {
    setIsOffers(false);
    setIsPackages(false);
    setIsMyWork(true);
  };

  const onPressCloseFilter = () => {
    setIsOffers(false);
    setIsPackages(false);
    setIsMyWork(false);
  };

  const onPressGoCart = () => {
    // @ts-ignore
    navigate(screenName.Cart);
  };

  const onPressBack = () => {
    goBack();
  };

  const onPressSearch = () => {
    if (animated.value === 1) {
      animated.value = 0;
      setAnimatedValue(0);
    } else {
      animated.value = 1;
      setAnimatedValue(1);
    }
  };

  const handleScroll = (event: any) => {
    if (event.nativeEvent.contentOffset.y > 250) {
      animated.value = 1;
      setAnimatedValue(1);
    } else {
      animated.value = 0;
      setAnimatedValue(0);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPressBack}
        style={{ position: "absolute", left: wp(20), zIndex: 1 }}
      >
        <SafeAreaView edges={["top"]} />
        <BackIcon />
      </TouchableOpacity>
      <Animated.ScrollView
        style={{ flex: 1 }}
        scrollEventThrottle={16}
        stickyHeaderIndices={[3]}
      >
        <Animated.Image
          style={styles.imgStyle}
          source={{ uri: params.img }}
          sharedTransitionTag={`sharedTag-${params.index}`}
        />
        {loading ? (
          <View style={{ paddingHorizontal: wp(20), paddingVertical: hp(10) }}>
            <UserItemLoader />
          </View>
        ) : (
          <View style={styles.rowStyle}>
            <FastImage
              resizeMode="cover"
              style={styles.personStyle}
              source={{
                uri:
                  itemDetails?.featured_image_url +
                  "/" +
                  itemDetails?.user?.user_profile_images?.[0]?.image,
                priority: FastImage.priority.high,
              }}
            />
            <View style={styles.columStyle}>
              <View
                style={{
                  ...styles.rowNameStyle,
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.nameTextStyle}>
                  {itemDetails?.user?.name}
                </Text>
                <VerifyIcon />
              </View>
              <View style={{ ...styles.rowNameStyle, marginVertical: hp(10) }}>
                <TouchableOpacity
                  style={styles.startContainer}
                  onPress={() => setIsModal(!isModal)}
                >
                  <Text style={styles.startTextStyle}>
                    {itemDetails?.user?.averageRating}
                  </Text>
                  <StarIcon />
                </TouchableOpacity>
                <View style={styles.dotStyle} />
                <Text style={styles.greyTextStyle}>{"343 Jobs Done"}</Text>
              </View>
              <View style={styles.rowNameStyle}>
                <CarIcon />
                <Text style={styles.locationTextStyle}>
                  {itemDetails?.user?.city?.[0].city_name}
                  {","}
                  {itemDetails?.user?.district?.[0].district_name}
                  {","}
                  {itemDetails?.user?.state?.[0].state_name}
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.gradinetStyle}>
          <View style={styles.offerContainer}>
            <OfferIcon />
          </View>
          <LinearGradient
            style={{ borderRadius: wp(50), height: hp(90) }}
            colors={["#D1F8F5", "#D9D9D900"]}
          >
            <Image style={styles.lineStyle} source={images.gradient_line} />
            <Text style={styles.offerTextStyle}>{"Flat 50% off"}</Text>
            <Text style={styles.greyOfferTextStyle}>
              {"NO CODE REQUIRED | ABOVE 999"}
            </Text>
          </LinearGradient>
        </View>

        <View
          style={[
            isHeaderSticky
              ? { position: "absolute", top: -130, backgroundColor: "#FAFAFA" }
              : { position: "absolute", top: -120 },
          ]}
        >
          <View style={{ ...styles.rowSpaceStyle }}>
            <TagView
              isSelected={isOffers}
              Icon={<OfferYellowIcon />}
              title={strings["Offers"]}
              onPress={onPressOffers}
              onPressClose={onPressCloseFilter}
            />
            <TagView
              isSelected={isPackages}
              title={strings["Packages"]}
              onPress={onPressPackages}
              onPressClose={onPressCloseFilter}
            />
            <TagView
              isSelected={isMyWork}
              title={strings["My Work"]}
              onPress={onPressMyWork}
              onPressClose={onPressCloseFilter}
            />
          </View>
        </View>

        <View style={{ flex: 1, marginTop: hp(-130) }}>
          {loading ? (
            <View style={{ marginTop: hp(40) }}>
              <OfferLoader />
            </View>
          ) : (
            <>
              {isOffers ? (
                <View key={"offer"}>
                  <FlatList
                    style={{ flex: 1 }}
                    data={[1]}
                    scrollEnabled={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                      return (
                        <StylistItem
                          key={`offer${index}`}
                          isOffer={true}
                          data={item}
                          offers={userOfferList}
                          index={index}
                        />
                      );
                    }}
                  />
                </View>
              ) : null}
            </>
          )}
          {loading ? (
            <View style={{ marginTop: hp(40) }}>
              <OfferLoader />
            </View>
          ) : (
            <>
              {isPackages ? (
                <View key={"package"}>
                  <FlatList
                    style={{ flex: 1 }}
                    data={[2]}
                    scrollEnabled={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                      return (
                        <PackagesItem
                          key={`package${index}`}
                          data={item}
                          packages={userPackageList}
                          index={index}
                        />
                      );
                    }}
                  />
                </View>
              ) : null}
            </>
          )}

          {isMyWork ? (
            <View key={`mywork`}>
              <FlatList
                style={{ flex: 1 }}
                data={[3]}
                scrollEnabled={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                  return (
                    <MyWorkItem
                      data={item}
                      index={index}
                      key={`work${index}`}
                    />
                  );
                }}
              />
            </View>
          ) : null}
        </View>
        <LinearGradient
          start={{ x: 0.0, y: 0.25 }}
          end={{ x: 0.5, y: 1.0 }}
          style={styles.gradinetViewStyle}
          colors={["#FFFFFF", "#E2F3F2"]}
        >
          <View>
            <Text style={styles.boldTextStyle}>{strings["Availability"]}</Text>
            {formatWorkingHours(itemDetails?.user?.working_hours)?.map(
              (item: any, index) => {
                return (
                  <View
                    style={{
                      ...styles.rowSpaceBottomViewStyle,
                      marginTop: index === 0 ? hp(20) : hp(10),
                    }}
                  >
                    <Text style={styles.dayTextStyle}>{item.day}</Text>
                    <Text style={styles.dayValueTextStyle}>
                      {item?.open == "Yes"
                        ? `${item.from} - ${item.to}`
                        : "Holiday"}
                    </Text>
                  </View>
                );
              }
            )}
            <View style={styles.lineBottomStyle} />
            <Text style={styles.boldTextStyle}>{strings["Amenities"]}</Text>
            <FlatList
              numColumns={4}
              data={formatData(itemDetails?.user?.amenities?.[0])}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => {
                if (item?.value === "Yes") {
                  return (
                    <View key={index} style={styles.itemContainer}>
                      <View style={styles.circleContainer}>
                        {getAmenitiesIcon(item.title)}
                      </View>
                      <Text style={styles.itemTextStyle}>
                        {convertStringToTitle(item.title)}
                      </Text>
                    </View>
                  );
                } else {
                  return null;
                }
              }}
            />
          </View>
        </LinearGradient>
      </Animated.ScrollView>
      <View style={styles.elevationStyle}>
        <Text style={styles.priceTextStyle}>
          {"₹"}
          {total}
        </Text>
        <TouchableOpacity onPress={onPressGoCart}>
          <ImageBackground
            resizeMode="cover"
            style={styles.cartBtnStyle}
            source={images.blue_button}
          >
            <Text style={styles.goTextStyle}>{strings["Go To Cart"]}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
      <Modals
        isIcon
        visible={isModal}
        close={setIsModal}
        contain={<ReviewModel />}
        containStyle={{ maxHeight: "80%" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background_grey,
  },
  rowStyle: {
    flexDirection: "row",
    padding: wp(20),
  },
  personStyle: {
    height: hp(111),
    width: wp(100),
    borderRadius: wp(10),
    backgroundColor: colors.grey_19,
  },
  nameTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 26, colors.black),
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
  gradinetStyle: {
    width: screen_width,
    height: hp(210),
    marginTop: hp(15),
  },
  offerContainer: {
    alignSelf: "center",
    position: "absolute",
    zIndex: 1,
    top: -hp(15),
  },
  lineStyle: {
    alignSelf: "center",
  },
  offerTextStyle: {
    ...commonFontStyle(fontFamily.bold, 17, colors.black),
    textAlign: "center",
    marginVertical: hp(10),
    marginTop: hp(15),
  },
  greyOfferTextStyle: {
    ...commonFontStyle(fontFamily.regular, 12, colors.gery_3),
    textAlign: "center",
  },
  rowSpaceStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(15),
    marginVertical: hp(0),
    backgroundColor: colors?.review_card_bg,
    paddingVertical: hp(20),
  },
  buttonStyle: {
    height: hp(40),
    width: wp(110),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(13),
  },
  btnTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 15, colors.black_2),
  },
  headerRowStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: wp(20),
    marginVertical: hp(10),
    alignItems: "center",
    marginTop: -hp(50),
  },
  titleTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 20, colors.black),
  },
  elevationStyle: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 15,
    backgroundColor: colors.white,
    padding: wp(20),
    flexDirection: "row",
    alignItems: "center",
  },
  cartBtnStyle: {
    height: hp(60),
    width: wp(170),
    alignItems: "center",
    justifyContent: "center",
  },
  goTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black_2),
  },
  priceTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 24, colors.black_2),
    flex: 1,
    textAlign: "center",
  },
  gradinetViewStyle: {
    borderWidth: 1,
    borderColor: colors.review_caed_border,
    margin: wp(20),
    borderRadius: 10,
    paddingBottom: hp(30),
    paddingTop: hp(10),
  },
  boldTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 20, colors.black),
    marginTop: hp(20),
    marginHorizontal: wp(20),
  },
  rowSpaceBottomViewStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: wp(20),
    marginVertical: hp(10),
  },
  lineBottomStyle: {
    borderTopWidth: 1,
    borderColor: colors.review_caed_border,
    marginVertical: hp(15),
  },
  itemContainer: {
    width: wp(79),
    marginTop: hp(20),
    marginHorizontal: wp(2),
  },
  circleContainer: {
    width: wp(50),
    height: wp(50),
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: wp(50 / 2),
    backgroundColor: colors.primary_light_blue_3,
  },
  itemTextStyle: {
    ...commonFontStyle(fontFamily.regular, 10, colors.black),
    textAlign: "center",
    marginTop: hp(5),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(10),
    paddingHorizontal: wp(20),
    backgroundColor: colors?.white,
    justifyContent: "space-between",
  },
  headerTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors?.black),
    marginHorizontal: wp(10),
    flex: 1,
  },
  searchContainer: {
    height: hp(45),
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: wp(10),
    backgroundColor: colors.background_grey,
  },
  inputStyle: {
    flex: 1,
    marginHorizontal: wp(10),
    ...commonFontStyle(fontFamily.regular, 15, colors.black),
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: wp(10),
    gap: wp(5),
  },
  shareContainer: {
    marginHorizontal: wp(5),
  },
  dayTextStyle: {
    ...commonFontStyle(fontFamily.regular, 14, colors.gery_6),
    textTransform: "capitalize",
  },
  dayValueTextStyle: {
    ...commonFontStyle(fontFamily.regular, 14, colors.black),
  },
  imgStyle: {
    width: "100%",
    height: 400,
    marginBottom: hp(10),
  },
});

export default StylistDetails;
