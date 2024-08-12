import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  InteractionManager,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import {
  BackHeader,
  Modals,
  OfferLoader,
  PackagesItem,
  ServiceItem,
  StylistItem,
  UserItemLoader,
} from "../../components";
import { images } from "../../theme/icons";
import {
  convertStringToTitle,
  formatData,
  formatWorkingHours,
  hp,
  infoToast,
  screen_width,
  wp,
} from "../../helper/globalFunction";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";
import {
  CarIcon,
  OfferIcon,
  StarIcon,
  VerifyIcon,
  OfferYellowIcon,
  TreeIcon,
  MusicIcon,
  WiFiIcon,
  CameraIcon,
  ProfileIcon,
  CardIcon,
  PetIcon,
  ElectricityIcon,
  BackIcon,
  SearchIcon,
  CloseIcon,
  FillLike,
  ShareIcon,
} from "../../theme/SvgIcon";
import { strings } from "../../helper/string";
import MyWorkItem from "../../components/Details/MyWorkItem";
import { useNavigation, useRoute } from "@react-navigation/native";
import { screenName } from "../../helper/routeNames";
import ReviewModel from "../../components/Details/ReviewModal";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Animation, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  getAllOffersByUser,
  getAllPackageByUser,
  getCartlist,
  getDeeplink,
  getUserItemDetails,
  getUsersFavList,
  removeAsfavourite,
  saveAsfavourite,
} from "../../actions";
import {
  getAsyncCoord,
  getAsyncUserInfo,
  setAsyncCartId,
} from "../../helper/asyncStorage";
import { ADD_TO_CART, CART_DETAILS } from "../../actions/dispatchTypes";
import FastImage from "react-native-fast-image";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ImageListModal from "../../components/common/ImageListModal";
import { thru } from "lodash";
import Animated from "react-native-reanimated";
import DeviceInfo from "react-native-device-info";
import Cart from "../Cart";

type TagViewProps = {
  Icon?: any;
  title: string;
  onPress: () => void;
  onPressClose: () => void;
  isSelected: boolean;
};

const TagView = ({
  Icon,
  title,
  onPress,
  isSelected,
  onPressClose,
}: TagViewProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      {isSelected ? (
        <ImageBackground
          resizeMode="contain"
          source={images.blue_border_button}
          style={{ ...styles.buttonStyle, justifyContent: "space-between" }}
        >
          <Text style={styles.btnTextStyle}>{title}</Text>
          <TouchableOpacity onPress={onPressClose}>
            <Text style={styles.btnTextStyle}>{"X"}</Text>
          </TouchableOpacity>
        </ImageBackground>
      ) : (
        <ImageBackground
          resizeMode="contain"
          source={images.grey_border_button}
          style={styles.buttonStyle}
        >
          <Text
            style={{
              ...styles.btnTextStyle,
              flex: 1,
              textAlign: !Icon ? "center" : null,
            }}
          >
            {title}
          </Text>
          {Icon}
        </ImageBackground>
      )}
    </TouchableOpacity>
  );
};

const getAmenitiesIcon = (key: string) => {
  switch (key) {
    case "parking_space":
      return <TreeIcon />;
    case "music":
      return <MusicIcon />;
    case "credit_cards_accepted":
      return <CardIcon />;
    case "wi_fi":
      return <WiFiIcon />;
    case "pets_friendly":
      return <PetIcon />;
    case "selfie_station":
      return <CameraIcon />;
    case "child_friendly":
      return <ProfileIcon />;
    case "power_backup":
      return <ElectricityIcon />;
    default:
      break;
  }
};

const YourStylist = () => {
  const { params }: any = useRoute();
  const { id } = params || {};
  const { cartDetails, addtocart } = useAppSelector((state) => state.cart);
  const { itemDetails } = useAppSelector((state) => state.home);
  const dispatch = useAppDispatch();
  const { navigate, goBack } = useNavigation();
  const { userOfferList } = useAppSelector((state) => state.offers);
  const { userPackageList } = useAppSelector((state) => state.package);
  const [isOffers, setIsOffers] = useState(false);
  const [isPackages, setIsPackages] = useState(false);
  const [isMyWork, setIsMyWork] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [total, setTotal] = useState(0);
  const animated = useSharedValue(0);
  const [animatedValue, setAnimatedValue] = useState(0);
  const [like, setLike] = useState(params?.like);
  const [likeID, setLikeID] = useState(params?.likeID);
  const [loading, setLoading] = useState(true);
  const [isImageModal, setIsImageModal] = useState(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width:
        animated.value === 1
          ? withTiming(275, { duration: 500 })
          : withTiming(0, { duration: 500 }),
    };
  });

  useEffect(() => {
    getDetails();
    if (Platform.OS === "android") {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
    getCart();
    if (params?.isPackages) {
      setIsOffers(false);
      setIsPackages(true);
      setIsMyWork(false);
    }
  }, []);

  useEffect(() => {
    if (Object.values(itemDetails).length > 0 || itemDetails.length) {
      getFavUser();
    }
  }, [itemDetails]);

  const getFavUser = async () => {
    let userInfo = await getAsyncUserInfo();
    let obj = {
      data: {
        userId: userInfo?.userId,
      },
      onSuccess: (response: any) => {
        response?.data.forEach((item) => {
          if (item?._id == itemDetails?.user?._id) {
            setLikeID(item?.favouriteId);
            setLike(true);
          } else {
            setLike(false);
          }
        });
      },
      onFailure: (Errr: any) => {
        console.log("getFavUser Errr", Errr);
      },
    };
    dispatch(getUsersFavList(obj));
  };

  useEffect(() => {
    if (addtocart?.length > 0 || Object.keys(addtocart)?.length > 0) {
      Calculate();
    } else {
      setTotal(0);
    }
  }, [addtocart]);

  const getCart = async () => {
    setLoading(true);
    let userInfo = await getAsyncUserInfo();
    let obj = {
      data: {
        userId: userInfo?.userId,
      },
      onSuccess: async (response: any) => {
        await setAsyncCartId(response?.data?.cart?.cart_id);
        setLoading(false);
        dispatch({ type: CART_DETAILS, payload: response?.data?.cart });
        dispatch({
          type: ADD_TO_CART,
          payload: response?.data?.cart,
        });
        let total = response?.data?.cart?.totalPrice;
        setTotal(total);
      },
      onFailure: (Errr: any) => {
        dispatch({ type: CART_DETAILS, payload: {} });
        dispatch({
          type: ADD_TO_CART,
          payload: [],
        });
        console.log("Errr", Errr);
        setLoading(false);
        setTotal(0);
      },
    };
    dispatch(getCartlist(obj));
  };

  const Calculate = useCallback(() => {
    let total = addtocart?.totalPrice;
    setTotal(total);
  }, [addtocart]);

  useEffect(() => {
    let obj = {
      id: id,
    };
    dispatch(getAllOffersByUser(obj));
    dispatch(getAllPackageByUser(obj));
  }, [itemDetails, id]);

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

  const onPressLike = async () => {
    let userInfo = await getAsyncUserInfo();
    let data = {
      userId: userInfo?.userId,
      expertId: id,
    };
    let obj = {
      data: data,
      onSuccess: (respone: any) => {
        let id = respone.data?._id;
        setLikeID(id);
        setLike(true);
      },
      onFailure: (err: any) => {
        console.log("Errr", err);
      },
    };

    let unlikeData = {
      data: {
        id: likeID,
      },
      onSuccess: () => {
        setLike(false);
      },
      onFailure: (err: any) => {},
    };

    like
      ? dispatch(removeAsfavourite(unlikeData))
      : dispatch(saveAsfavourite(obj));
  };

  const getDetails = async () => {
    const response = await getAsyncCoord();
    let userid = id;
    let obj = {
      data: {
        userid: userid,
        latitude: response?.latitude,
        longitude: response?.longitude,
      },
      onSuccess: (res: any) => {},
      onFailure: () => {},
    };
    dispatch(getUserItemDetails(obj));
  };

  const onPressShare = () => {
    let obj = {
      params: {
        platform: Platform.OS === "ios" ? "ios" : "android",
      },
      onSuccess: (response: any) => {
        let url = response?.deepLinkUrl;
        onShare(url);
      },
      onFailure: (error) => {},
    };
    dispatch(getDeeplink(obj));
  };

  const onShare = async (message: string) => {
    try {
      const result = await Share.share({
        message: message,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      infoToast(error.message);
    }
  };

  const onPressSearchBox = () => {
    // @ts-ignore
    navigate(screenName.SearchItem);
  };

  return (
    <View style={{ ...styles.container }}>
      <View style={styles.mainHeaderContainer}>
        <View style={{ height: DeviceInfo.hasNotch() ? hp(50) : 0 }} />
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={onPressBack}>
            <BackIcon />
          </TouchableOpacity>
          <View style={styles.rowEndStyle}>
            <TouchableOpacity onPress={onPressLike}>
              <FillLike fill={like ? "#000" : "none"} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onPressShare}
              style={styles.shareContainer}
            >
              <ShareIcon />
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressSearchBox}>
              <SearchIcon />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Animation.ScrollView
        stickyHeaderIndices={[2]}
        style={{ flex: 1 }}
        scrollEventThrottle={16}
        onScroll={handleScroll}
      >
        {loading ? (
          <View style={{ paddingHorizontal: wp(20), paddingVertical: hp(10) }}>
            <UserItemLoader />
          </View>
        ) : (
          <View style={styles.rowStyle}>
            <TouchableOpacity onPress={() => setIsImageModal(true)}>
              <FastImage
                resizeMode="cover"
                style={styles.personStyle}
                source={{
                  uri:
                    itemDetails?.featured_image_url +
                    "/" +
                    itemDetails?.user?.user_profile_images?.filter(
                      (images) => images?.is_featured == 1
                    )?.[0]?.image,
                  priority: FastImage.priority.high,
                }}
              />
            </TouchableOpacity>
            <View style={styles.columStyle}>
              {(itemDetails?.user?.salon_name ||
                itemDetails?.user?.distance) && (
                <View style={styles.salooninfo}>
                  <Text style={styles?.saloontitle}>
                    {itemDetails?.user?.salon_name}
                  </Text>
                  {itemDetails?.user?.distance &&
                    itemDetails?.user?.salon_name && (
                      <View style={styles.seprator} />
                    )}
                  {itemDetails?.user?.distance && (
                    <Text
                      style={styles?.saloontitle}
                    >{`${itemDetails?.user?.distance} km`}</Text>
                  )}
                </View>
              )}
              <View
                style={{
                  ...styles.rowNameStyle,
                }}
              >
                <Text numberOfLines={1} style={styles.nameTextStyle}>
                  {itemDetails?.user?.name}
                </Text>
                <VerifyIcon />
              </View>
              <View style={{ ...styles.rowNameStyle, marginVertical: hp(10) }}>
                <TouchableOpacity
                  disabled={true}
                  style={styles.startContainer}
                  onPress={() => setIsModal(!isModal)}
                >
                  <Text style={styles.startTextStyle}>
                    {itemDetails?.user?.averageRating}
                  </Text>
                  <StarIcon />
                </TouchableOpacity>
                <View style={styles.dotStyle} />
                <Text style={styles.greyTextStyle}>
                  {itemDetails?.user?.jobDone > 0
                    ? itemDetails?.user?.jobDone
                    : null}
                  {itemDetails?.user?.jobDone > 0
                    ? " Jobs Done"
                    : "New Stylist"}
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
            {itemDetails?.offers?.[0]?.discount ? (
              <>
                <Text
                  style={styles.offerTextStyle}
                >{`Flat ${itemDetails?.offers?.[0]?.discount}% off`}</Text>
                <Text style={styles.greyOfferTextStyle}>
                  {"NO CODE REQUIRED | ABOVE 999"}
                </Text>
              </>
            ) : (
              <Text style={styles.offerTextStyle}>{"No Offers"}</Text>
            )}
          </LinearGradient>
        </View>

        <View style={styles.rowOfferMainContainer}>
          <View style={styles.rowSpaceStyle}>
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
              {!isOffers && !isPackages && !isMyWork ? (
                <View key={"service"}>
                  <FlatList
                    style={{ flex: 1 }}
                    data={[1]}
                    scrollEnabled={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                      return (
                        <ServiceItem
                          data={item}
                          index={index}
                          key={`service${index}`}
                          service={itemDetails?.user?.sub_services}
                          baseUrl={itemDetails?.featured_image_url}
                          actionId={itemDetails?.user?._id}
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
                          actionId={itemDetails?.user?._id}
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
                          actionId={itemDetails?.user?._id}
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
      </Animation.ScrollView>
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
      <ImageListModal
        baseURL={itemDetails?.featured_image_url}
        data={itemDetails?.user?.user_profile_images}
        isVisible={isImageModal}
        onPressClose={() => setIsImageModal(false)}
      />
    </View>
  );
};

export default YourStylist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background_grey,
  },
  rowStyle: {
    flexDirection: "row",
    paddingHorizontal: wp(20),
    alignItems: "center",
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
    height: hp(200),
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
    paddingVertical: hp(5),
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
    padding: wp(15),
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.grey_19,
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
    justifyContent: "space-between",
  },
  mainHeaderContainer: {
    width: "100%",
    paddingBottom: hp(20),
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
    ...commonFontStyle(fontFamily.regular, 15, colors.gery_6),
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: wp(10),
    gap: wp(5),
  },
  shareContainer: {
    marginHorizontal: wp(10),
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
    height: 250,
    marginBottom: hp(10),
  },
  rowEndStyle: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  rowOfferMainContainer: {
    position: "absolute",
    top: -120,
  },
  salooninfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  saloontitle: {
    ...commonFontStyle(fontFamily.medium, 12, colors.black),
    lineHeight: hp(20),
  },
  seprator: {
    width: wp(4),
    height: wp(4),
    backgroundColor: colors.dark_grey,
    borderRadius: wp(50),
    marginHorizontal: wp(7),
  },
});
