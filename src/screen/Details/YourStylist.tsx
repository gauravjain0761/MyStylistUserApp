import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  ImageBackground,
  InteractionManager,
  Platform,
  ScrollView,
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
  PackagesItem,
  StylistItem,
} from "../../components";
import { images } from "../../theme/icons";
import { hp, screen_width, wp } from "../../helper/globalFunction";
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
import { useNavigation } from "@react-navigation/native";
import { screenName } from "../../helper/routeNames";
import ReviewModel from "../../components/Details/ReviewModal";
import LinearGradient from "react-native-linear-gradient";
import { is } from "@babel/types";
import { SafeAreaView } from "react-native-safe-area-context";
import Animation, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

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
          source={images.black_border_button}
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
          {Icon}
          {Icon ? <View style={{ width: wp(10) }} /> : null}
          <Text
            style={{
              ...styles.btnTextStyle,
              flex: 1,
              textAlign: !Icon ? "center" : null,
            }}
          >
            {title}
          </Text>
        </ImageBackground>
      )}
    </TouchableOpacity>
  );
};

const amenitiesData = [
  { id: 1, title: "Parking Space", icon: <TreeIcon /> },
  { id: 2, title: "Music", icon: <MusicIcon /> },
  { id: 2, title: "Wi-Fi", icon: <WiFiIcon /> },
  { id: 2, title: "Selfie Station", icon: <CameraIcon /> },
  { id: 2, title: "Child-Friendly", icon: <ProfileIcon /> },
  { id: 2, title: "Credit Cards Accepted", icon: <CardIcon /> },
  { id: 2, title: "Pets Friendly", icon: <PetIcon /> },
  { id: 2, title: "Power Backup", icon: <ElectricityIcon /> },
];

const YourStylist = () => {
  const { navigate, goBack } = useNavigation();
  const [isOffers, setIsOffers] = useState(false);
  const [isPackages, setIsPackages] = useState(false);
  const [isMyWork, setIsMyWork] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const animated = useSharedValue(0);
  const [animatedValue, setAnimatedValue] = useState(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width:
        animated.value === 1
          ? withTiming(275, { duration: 500 })
          : withTiming(0, { duration: 500 }),
    };
  });

  useEffect(() => {
    if (Platform.OS === "android") {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
  }, []);

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

  const handleStickyHeaderEvent = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    if (Math.floor(scrollPosition) == 241) {
      setIsHeaderSticky(true);
    } else if (Math.floor(scrollPosition) < 240) {
      setIsHeaderSticky(false);
    }
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

  // const Header_Max_Height = 600;
  // const Header_Min_Height = 50;
  // const Scroll_Distance = Header_Max_Height - Header_Min_Height;

  // const scrollOffsetY = useRef(new Animated.Value(0)).current;

  // const animatedHeaderColor = scrollOffsetY.interpolate({
  //   inputRange: [0, Scroll_Distance / 1, Scroll_Distance],
  //   outputRange: ["rgba(255,255,255,0.0)", "#FAFAFA", "#FAFAFA"],
  //   extrapolate: "identity",
  // });

  const handleScroll = (event) => {
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
      <SafeAreaView style={styles.headerContainer} edges={["top"]}>
        <TouchableOpacity onPress={onPressBack}>
          <BackIcon />
        </TouchableOpacity>
        {animatedValue === 0 ? (
          <Text numberOfLines={1} style={styles.headerTextStyle}>
            {"Your Stylist"}
          </Text>
        ) : null}
        <Animation.View style={[styles.searchContainer, animatedStyle]}>
          <TextInput
            style={styles.inputStyle}
            placeholder="Search Here..."
            placeholderTextColor={colors.gery_2}
          />
        </Animation.View>

        <TouchableOpacity onPress={onPressSearch}>
          {animatedValue === 0 ? <SearchIcon /> : <CloseIcon />}
        </TouchableOpacity>
      </SafeAreaView>
      <Animation.ScrollView
        // onScroll={handleStickyHeaderEvent}
        stickyHeaderIndices={[2]}
        style={{ flex: 1 }}
        scrollEventThrottle={16}
        onScroll={handleScroll}
      >
        <View style={styles.rowStyle}>
          <Image style={styles.personStyle} source={images.barber} />
          <View style={styles.columStyle}>
            <View
              style={{
                ...styles.rowNameStyle,
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.nameTextStyle}>{"Majid Khan"}</Text>
              <VerifyIcon />
              <View style={styles.iconContainer}>
                <TouchableOpacity>
                  <FillLike />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginBottom: hp(4) }}>
                  <ShareIcon />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ ...styles.rowNameStyle, marginVertical: hp(10) }}>
              <TouchableOpacity
                style={styles.startContainer}
                onPress={() => setIsModal(!isModal)}
              >
                <Text style={styles.startTextStyle}>{4.6}</Text>
                <StarIcon />
              </TouchableOpacity>
              <View style={styles.dotStyle} />
              <Text style={styles.greyTextStyle}>{"343 Jobs Done"}</Text>
            </View>
            <View style={styles.rowNameStyle}>
              <CarIcon />
              <Text style={styles.locationTextStyle}>
                {"Sector 67, Mohali"}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.gradinetStyle}>
          <View style={styles.offerContainer}>
            <OfferIcon />
          </View>
          <LinearGradient
            style={{ borderRadius: wp(50), flex: 1 }}
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
          {!isOffers && !isPackages && !isMyWork ? (
            <View>
              <FlatList
                style={{ flex: 1 }}
                data={[1, 2, 3, 4, 5, 6, 7, 8]}
                scrollEnabled={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                  return <StylistItem data={item} />;
                }}
              />
            </View>
          ) : null}

          {isOffers ? (
            <View>
              <FlatList
                style={{ flex: 1 }}
                data={[1]}
                scrollEnabled={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                  return <StylistItem isOffer={true} data={item} />;
                }}
              />
            </View>
          ) : null}

          {isPackages ? (
            <View>
              <FlatList
                style={{ flex: 1 }}
                data={[1, 2, 3, 4, 5, 6, 7, 8]}
                scrollEnabled={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                  return <PackagesItem data={item} />;
                }}
              />
            </View>
          ) : null}
          {isMyWork ? (
            <View>
              <FlatList
                style={{ flex: 1 }}
                data={[1, 2, 3, 4, 5, 6, 7, 8]}
                scrollEnabled={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                  return <MyWorkItem data={item} />;
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
            <View
              style={{ ...styles.rowSpaceBottomViewStyle, marginTop: hp(20) }}
            >
              <Text>{strings["All Days"]}</Text>
              <Text>{"10AM - 10PM"}</Text>
            </View>
            <View style={styles.rowSpaceBottomViewStyle}>
              <Text>{"Tuesday"}</Text>
              <Text>{"Holiday"}</Text>
            </View>
            <View style={styles.lineBottomStyle} />
            <Text style={styles.boldTextStyle}>{strings["Amenities"]}</Text>
            <FlatList
              numColumns={4}
              data={amenitiesData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => {
                return (
                  <View key={index} style={styles.itemContainer}>
                    <View style={styles.circleContainer}>{item.icon}</View>
                    <Text style={styles.itemTextStyle}>{item.title}</Text>
                  </View>
                );
              }}
            />
          </View>
        </LinearGradient>
      </Animation.ScrollView>
      <View style={styles.elevationStyle}>
        <Text style={styles.priceTextStyle}>{"₹200"}</Text>
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
        containStyle={{ maxHeight: "80%" }}
        visible={isModal}
        close={setIsModal}
        isIcon
        contain={<ReviewModel />}
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
    padding: wp(20),
  },
  personStyle: {
    height: hp(111),
    width: wp(100),
    borderRadius: wp(10),
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
    marginHorizontal: wp(20),
    marginVertical: hp(0),
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
    ...commonFontStyle(fontFamily.semi_bold, 14, colors.black_2),
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
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
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
    paddingVertical: hp(17),
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
});
