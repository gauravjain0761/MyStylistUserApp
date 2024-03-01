import React from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BackHeader, StylistItem } from "../../components";
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

type TagViewProps = {
  Icon?: any;
  title: string;
  onPress: () => void;
  isSelected: boolean;
};

const TagView = ({ Icon, title, onPress, isSelected }: TagViewProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <ImageBackground
        resizeMode="contain"
        source={
          isSelected ? images.black_border_button : images.grey_border_button
        }
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
        <TouchableOpacity></TouchableOpacity>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const YourStylist = () => {
  return (
    <View style={styles.container}>
      <BackHeader title={"Your Stylist"} />
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.rowStyle}>
          <Image style={styles.personStyle} source={images.barber} />
          <View style={styles.columStyle}>
            <View style={styles.rowNameStyle}>
              <Text style={styles.nameTextStyle}>{"Majid Khan"}</Text>
              <VerifyIcon />
            </View>
            <View style={{ ...styles.rowNameStyle, marginVertical: hp(10) }}>
              <View style={styles.startContainer}>
                <Text style={styles.startTextStyle}>{4.6}</Text>
                <StarIcon />
              </View>
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
            <TagView Icon={<OfferYellowIcon />} title={strings["Offers"]} />
            <TagView title={strings["Packages"]} />
            <TagView title={strings["My Work"]} />
          </View>
          <TouchableOpacity style={styles.headerRowStyle}>
            <Text style={styles.titleTextStyle}>{"Hair Treatment"}</Text>
            <ArrowUp />
          </TouchableOpacity>
        </ImageBackground>
        <View>
          <FlatList
            style={{ flex: 1 }}
            data={[1, 2, 3, 4, 5, 6, 7, 8]}
            scrollEnabled={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              return <StylistItem />;
            }}
          />
        </View>
      </ScrollView>
      <View style={styles.elevationStyle}>
        <Text style={styles.priceTextStyle}>{"₹200"}</Text>
        <TouchableOpacity>
          <ImageBackground
            resizeMode="cover"
            style={styles.cartBtnStyle}
            source={images.blue_button}
          >
            <Text style={styles.goTextStyle}>{strings["Go To Cart"]}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
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
