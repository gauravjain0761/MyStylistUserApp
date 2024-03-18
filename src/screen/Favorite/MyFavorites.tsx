import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { BackHeader, Barber_Card } from "../../components";
import { strings } from "../../helper/string";
import { hp, screen_height, wp } from "../../helper/globalFunction";
import { barbers } from "../../helper/constunts";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "../../helper/routeNames";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getUsersFavList } from "../../actions";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";

const MyFavorites = () => {
  const { navigate } = useNavigation();
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((state) => state.common);
  const { favoriteList } = useAppSelector((state) => state.favourite);

  useEffect(() => {
    let obj = {
      data: {
        userId: userInfo?._id,
      },
      onSuccess: () => {},
      onFailure: () => {},
    };
    dispatch(getUsersFavList(obj));
  }, []);

  const onPressCard = () => {
    navigate(screenName.YourStylist);
  };
  return (
    <View style={styles.container}>
      <BackHeader title={strings.My_Favorites} />
      <View style={styles?.barber_card_container}>
        {favoriteList?.data?.length > 0 ? (
          <FlatList
            data={favoriteList?.data || []}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return (
                <Barber_Card
                  img_url={favoriteList?.user_profile_images_url}
                  data={item}
                  name={item.name}
                  type="Without Service"
                  // images={item?.image}
                  // rating={item?.rating}
                  // jobs={item?.jobs_done}
                  // location={item?.address}
                  // offers={item?.offers}
                  barberdetailscontinerStyle={styles.barberdetailscontinerStyle}
                  onPress={onPressCard}
                  // onPress={onPressItem}
                  // onPressRating={setReviewModal}
                />
              );
            }}
            contentContainerStyle={{
              marginVertical: hp(20),
              marginBottom: hp(20),
            }}
            ItemSeparatorComponent={() => (
              <View style={styles.card_separator}></View>
            )}
            ListFooterComponent={<View style={{ height: hp(20) }} />}
          />
        ) : (
          <View style={styles.centerStyle}>
            <Text style={styles.noDataTextStyle}>{"No Data"}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default MyFavorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  barber_card_container: {
    marginHorizontal: wp(20),
    flex: 1,
  },
  card_separator: {
    height: hp(24),
  },
  barberdetailscontinerStyle: {
    marginTop: hp(20),
  },
  centerStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 16, colors.gery_3),
  },
});
