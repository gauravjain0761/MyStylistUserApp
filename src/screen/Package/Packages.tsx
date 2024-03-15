import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import { BackHeader, Filter_Button } from "../../components";
import { strings } from "../../helper/string";
import { hp, screen_width, wp } from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { images } from "../../theme/icons";
import { VerifyIcon } from "../../theme/SvgIcon";
import { offer_filter } from "../../helper/constunts";
import { screenName } from "../../helper/routeNames";

const Packages = ({ navigation }) => {
  const onPressMenu = () => {
    navigation.openDrawer();
  };

  const onPressNewYearOffer = () => {
    navigation.navigate(screenName.NewYearOffer);
  };

  return (
    <View style={styles.container}>
      <BackHeader
        isMenu
        isSearch
        title={strings.Packages}
        onPressMenu={onPressMenu}
      />
      <ScrollView stickyHeaderIndices={[1]}>
        <Image
          style={styles.bannerImgStyle}
          resizeMode="cover"
          source={{
            uri: "https://img.freepik.com/premium-photo/portrait-young-gorgeous-woman-dressed-jewelry-set-necklace-ring-bracelet-earrings-pretty-blue-eyed-model-is-demonstrating-attractive-makeup-manicure_353119-75.jpg",
          }}
        />
        <FlatList
          style={styles.filterStyle}
          data={offer_filter}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }: any) => {
            return (
              <Filter_Button
                type={"simple"}
                onPress={() => {}}
                containerStyle={
                  offer_filter.length - 1 == index
                    ? { marginRight: wp(10) }
                    : null
                }
                title={item?.title}
                btn_bg={{ paddingHorizontal: wp(15) }}
              />
            );
          }}
          ItemSeparatorComponent={() => (
            <View style={styles.filter_item_separator}></View>
          )}
        />
        <View>
          <FlatList
            style={styles.flatListStyle}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={[1, 2, 3, 4]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity>
                  <ImageBackground
                    borderRadius={10}
                    resizeMode="cover"
                    style={styles.offersContainer}
                    source={images.offers_view}
                  >
                    <Text style={styles.smallTextStyle}>{"Minimum"}</Text>
                    <Text style={styles.boldTextStyle}>{"30% Off"}</Text>
                  </ImageBackground>
                </TouchableOpacity>
              );
            }}
          />
          <TouchableOpacity onPress={onPressNewYearOffer}>
            <ImageBackground
              source={images.new_offres}
              style={styles.imgStyle}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.offerContainer}>
            <ImageBackground
              borderTopLeftRadius={10}
              borderTopRightRadius={10}
              source={images.man_hair_cut}
              style={styles.manImgStyle}
            />
            <View style={styles.infoContainer}>
              <Image
                resizeMode="cover"
                source={images.barber}
                style={styles.barberImgStyle}
              />
              <View style={{ marginLeft: wp(10), flex: 1 }}>
                <View style={styles.rowStyle}>
                  <Text style={styles.nameTextStyle}>{"Majid Khan"}</Text>
                  <VerifyIcon width={15} height={15} />
                </View>
                <Text style={styles.addressTextStyle}>
                  {"Sector 67, Mohali"}
                </Text>
              </View>
              <Text style={styles.dateTextStyle}>
                {"Offer Till: 26 May, 2024"}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ ...styles.offerContainer, marginTop: hp(15) }}
          >
            <ImageBackground
              borderTopLeftRadius={10}
              borderTopRightRadius={10}
              source={{
                uri: "https://media.istockphoto.com/id/1136547713/photo/woman-with-a-long-straight-hair.jpg?s=170667a&w=is&k=20&c=z4rsTi8CnBGVHWJqE5G4blH2-oFDCTbHP6uiCD3yZkM=",
              }}
              style={styles.womaImgStyle}
              resizeMode="cover"
            />
            <View style={styles.infoContainer}>
              <Image
                resizeMode="cover"
                source={images.barber}
                style={styles.barberImgStyle}
              />
              <View style={{ marginLeft: wp(10), flex: 1 }}>
                <View style={styles.rowStyle}>
                  <Text style={styles.nameTextStyle}>{"Majid Khan"}</Text>
                  <VerifyIcon width={15} height={15} />
                </View>
                <Text style={styles.addressTextStyle}>
                  {"Sector 67, Mohali"}
                </Text>
              </View>
              <Text style={styles.dateTextStyle}>
                {"Offer Till: 26 May, 2024"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background_grey,
  },
  bannerImgStyle: {
    width: screen_width,
    height: hp(280),
    borderRadius: 15,
    marginVertical: hp(15),
  },
  offersContainer: {
    height: hp(83),
    width: wp(220),
    borderRadius: 5,
    marginLeft: wp(10),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary_light_blue_2,
  },
  flatListStyle: {
    paddingLeft: wp(10),
  },
  smallTextStyle: {
    ...commonFontStyle(fontFamily.regular, 12, colors.black),
  },
  boldTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 20, colors.black),
  },
  imgStyle: {
    height: hp(290),
    width: screen_width,
    marginTop: hp(10),
  },
  offerContainer: {
    height: hp(366),
    marginHorizontal: wp(20),
  },
  manImgStyle: {
    height: hp(290),
    borderRadius: 10,
  },
  womaImgStyle: {
    height: hp(290),
    borderRadius: 10,
  },
  infoContainer: {
    borderWidth: 1,
    padding: wp(13),
    borderColor: colors.gery_7,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  barberImgStyle: {
    height: wp(48),
    width: wp(48),
    borderRadius: 10,
  },
  nameTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 14, colors.black),
    marginRight: wp(5),
  },
  rowStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  addressTextStyle: {
    ...commonFontStyle(fontFamily.regular, 12, colors.gery_9),
  },
  dateTextStyle: {
    ...commonFontStyle(fontFamily.regular, 11, colors.gery_9),
  },
  filter_item_separator: {
    width: wp(7),
  },
  filterStyle: {
    paddingLeft: wp(20),
    paddingVertical: hp(10),
    backgroundColor: colors.background_grey,
  },
});

export default Packages;
