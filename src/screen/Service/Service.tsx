import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { BackHeader, Barber_Card, Filter_Button } from "../../components";
import { strings } from "../../helper/string";
import { images } from "../../theme/icons";
import { hp, wp } from "../../helper/globalFunction";
import { barbers, stylists_filter } from "../../helper/constunts";
import { colors } from "../../theme/color";
import { fontFamily, commonFontStyle } from "../../theme/fonts";

const Service = () => {
  return (
    <View style={styles.container}>
      <BackHeader isSearch title={strings.Party_Makeup} />
      <ScrollView
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
      >
        <Image source={images.banner2} style={styles.banner} />
        <View style={styles?.service_filter_conatiner}>
          <FlatList
            data={stylists_filter}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }: any) => {
              return (
                <Filter_Button
                  onPress={() => {}}
                  title={item?.title}
                  containerStyle={
                    stylists_filter.length - 1 == index
                      ? { marginRight: wp(10) }
                      : null
                  }
                  type={item?.isIcon == true ? "icon" : "simple"}
                />
              );
            }}
            ItemSeparatorComponent={() => (
              <View style={styles?.filter_item_separator}></View>
            )}
          />
        </View>
        <View style={styles?.stylists_title_container}>
          <View style={styles?.title_border}></View>
          <Text style={styles?.your_stylists_title}>
            {strings?.YOUR_Stylists}
          </Text>
          <View style={styles?.title_border}></View>
        </View>
        <ScrollView style={styles.card_container}>
          <FlatList
            data={barbers}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }: any) => {
              return (
                <Barber_Card
                  name={item.name}
                  type="with Service"
                  images={item?.image}
                  rating={item.rating}
                  jobs={item?.jobs_done}
                  location={item.address}
                  offers={item?.offers}
                  service="Party Makeup"
                  price="₹500"
                  carouselitemHeight={hp(157)}
                  carouselitemWidth={wp(132)}
                />
              );
            }}
            ItemSeparatorComponent={() => (
              <View style={styles.card_separator}></View>
            )}
          />
        </ScrollView>
      </ScrollView>
    </View>
  );
};

export default Service;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background_grey,
  },
  banner: {
    width: "100%",
    height: hp(216),
  },
  service_filter_conatiner: {
    paddingLeft: wp(20),
    paddingVertical: hp(15),
    backgroundColor: colors.background_grey,
  },
  filter_item_separator: {
    width: wp(7),
  },
  title_border: {
    width: "100%",
    borderBottomWidth: hp(1),
    borderColor: colors?.stylists_border_color,
    marginHorizontal: wp(10),
    alignSelf: "center",
    backgroundColor: "yellow",
  },
  stylists_title_container: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    justifyContent: "center",
    marginBottom: hp(20),
    marginHorizontal: wp(20),
    overflow: "hidden",
  },
  your_stylists_title: {
    ...commonFontStyle(fontFamily.regular, 17, colors?.stylists_title_gray),
    paddingHorizontal: wp(16),
  },
  card_separator: {
    height: hp(28),
  },
  card_container: {
    marginHorizontal: wp(20),
    marginTop: hp(10),
  },
});
