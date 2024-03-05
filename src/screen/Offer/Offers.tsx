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
import { BackHeader } from "../../components";
import { strings } from "../../helper/string";
import { hp, screen_width, wp } from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { images } from "../../theme/icons";

const Offers = ({ navigation }) => {
  const onPressMenu = () => {
    navigation.openDrawer();
  };
  return (
    <View style={styles.container}>
      <BackHeader
        isMenu
        isSearch
        title={strings.Offers}
        onPressMenu={onPressMenu}
      />
      <ScrollView>
        <Image
          style={styles.bannerImgStyle}
          resizeMode="cover"
          source={{
            uri: "https://img.freepik.com/premium-photo/portrait-young-gorgeous-woman-dressed-jewelry-set-necklace-ring-bracelet-earrings-pretty-blue-eyed-model-is-demonstrating-attractive-makeup-manicure_353119-75.jpg",
          }}
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
          <TouchableOpacity>
            <ImageBackground
              source={images.new_offres}
              style={styles.imgStyle}
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
    marginLeft: wp(10),
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
  },
  offerContainer: {
    height: hp(366),
    marginHorizontal: wp(20),
  },
  manImgStyle: {
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
});

export default Offers;
