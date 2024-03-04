import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import {
  BackHeader,
  CongratulationModal,
  TimeSelector,
  WeekDateSelector,
} from "../components";
import { strings } from "../helper/string";
import {
  dispatchNavigation,
  generateTimes,
  generateWeekDates,
  hp,
  wp,
} from "../helper/globalFunction";
import { colors } from "../theme/color";
import { commonFontStyle, fontFamily } from "../theme/fonts";
import { CarIcon, StarIcon, VerifyIcon } from "../theme/SvgIcon";
import { images } from "../theme/icons";
import moment from "moment";
import { screenName } from "../helper/routeNames";

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
  const [dates, setDates] = useState(generateWeekDates());
  const [times, setTimes] = useState(generateTimes());
  const [isShowCongrestModal, setIsShowCongrestModal] = useState(false);

  const onPressDateItem = (item: any) => {
    let data = [...dates];

    dates.map((eItem, index) => {
      if (eItem.id === item.id) {
        eItem.isSelected = true;
      } else {
        eItem.isSelected = false;
      }
    });
    setDates(data);
  };

  const onPressTimeItem = (item: any) => {
    let data = [...times];
    times.map((eItem, index) => {
      if (eItem.id === item.id) {
        eItem.isSelected = true;
      } else {
        eItem.isSelected = false;
      }
    });
    setTimes(data);
  };

  let data = ["1"];

  const onPressBook = () => {
    setIsShowCongrestModal(true);
  };

  return (
    <View style={styles.container}>
      <BackHeader title={strings["Cart"]} />
      {data?.length === 0 ? (
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
                <Image style={styles.personStyle} source={images.barber} />
                <View style={styles.columStyle}>
                  <View style={styles.rowNameStyle}>
                    <Text style={styles.nameTextStyle}>{"Majid Khan"}</Text>
                    <VerifyIcon />
                  </View>
                  <View
                    style={{ ...styles.rowNameStyle, marginVertical: hp(10) }}
                  >
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
            </View>
            <View style={{ ...styles.whiteContainer, marginTop: 0 }}>
              <Text style={styles.titleStyle}>{strings["Bill Details"]}</Text>
              <RowItemValue title="Hair Cut" value="₹200" />
              <RowItemValue title="Beard Trim" value="₹100" />
              <RowItemValue title="Hair color" value="₹500" />
              <RowItemValue title="Discount Applied" value="-₹300" />
              <RowItemValue title="Tax" value="₹50" />
              <RowItemValue title="Payment Method" value="Cash" />
              <View style={styles.lineStyle} />
              <View style={styles.rowSpaceStyle}>
                <Text style={styles.valueTextStyle}>{"Total (INR)"}</Text>
                <Text style={styles.valueTextStyle}>{"₹550.00"}</Text>
              </View>
            </View>
            <View style={{ ...styles.whiteContainer, marginTop: 0 }}>
              <Text style={styles.titleStyle}>{strings["Select Date"]}</Text>
              <WeekDateSelector
                list={dates}
                onPressDate={(index) => onPressDateItem(dates[index])}
              />
            </View>
            <View style={{ ...styles.whiteContainer, marginTop: 0 }}>
              <Text style={styles.titleStyle}>{strings["Select Time"]}</Text>
              <TimeSelector
                data={times}
                onPressTime={(index) => onPressTimeItem(times[index])}
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
