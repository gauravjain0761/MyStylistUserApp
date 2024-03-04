import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
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
  ArrowUp,
  CarIcon,
  OfferIcon,
  StarIcon,
  VerifyIcon,
  OfferYellowIcon,
} from "../../theme/SvgIcon";
import { strings } from "../../helper/string";
import MyWorkItem from "../../components/Details/MyWorkItem";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "../../helper/routeNames";
import ReviewModel from "../../components/Details/ReviewModal";

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

const YourStylist = () => {
  const { navigate } = useNavigation();
  const [isOffers, setIsOffers] = useState(false);
  const [isPackages, setIsPackages] = useState(false);
  const [isMyWork, setIsMyWork] = useState(false);
  const [isModal, setIsModal] = useState(false);

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

  return (
    <View style={styles.container}>
      <BackHeader isSearch title={"Your Stylist"} />
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.rowStyle}>
          <Image style={styles.personStyle} source={images.barber} />
          <View style={styles.columStyle}>
            <View style={styles.rowNameStyle}>
              <Text style={styles.nameTextStyle}>{"Majid Khan"}</Text>
              <VerifyIcon />
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
        <ImageBackground
          style={styles.gradinetStyle}
          source={images.gradinet_details}
        >
          <Image style={styles.lineStyle} source={images.gradient_line} />
          <View style={styles.offerContainer}>
            <OfferIcon />
          </View>
          <Text style={styles.offerTextStyle}>{"Flat 50% off"}</Text>
          <Text style={styles.greyOfferTextStyle}>
            {"NO CODE REQUIRED | ABOVE 999"}
          </Text>
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
        </ImageBackground>

        <View style={{ marginTop: -hp(80) }}>
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
      </ScrollView>
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
  gradinetStyle: {
    width: screen_width,
    height: hp(210),
    marginTop: hp(15),
  },
  offerContainer: {
    marginTop: -hp(20),
    alignSelf: "center",
  },
  lineStyle: {
    alignSelf: "center",
  },
  offerTextStyle: {
    ...commonFontStyle(fontFamily.bold, 17, colors.black),
    textAlign: "center",
    marginVertical: hp(10),
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
    marginVertical: hp(20),
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
});
