import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  BackHeader,
  Barber_Card,
  FavouriteCard,
  UserItemLoader,
} from "../../components";
import { strings } from "../../helper/string";
import { hp, screen_height, wp } from "../../helper/globalFunction";
import { barbers } from "../../helper/constunts";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { screenName } from "../../helper/routeNames";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getUsersFavList } from "../../actions";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";
import { getAsyncUserInfo } from "../../helper/asyncStorage";

const MyFavorites = () => {
  const { navigate } = useNavigation();
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((state) => state.common);
  const { favoriteList } = useAppSelector((state) => state.favourite);
  const [refreshControl, setRefreshControle] = useState(false);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  const getData = async () => {
    let userInfo = await getAsyncUserInfo();

    let obj = {
      data: {
        userId: userInfo?._id,
      },
      onSuccess: () => {
        setLoading(false);
      },
      onFailure: () => {
        setLoading(false);
      },
    };
    dispatch(getUsersFavList(obj));
  };

  const onPressCard = (item: any) => {
    navigate(screenName.YourStylist, { id: item?._id });
  };

  const onRefresh = useCallback(async () => {
    setRefreshControle(true);
    getData();
    setRefreshControle(false);
  }, [refreshControl]);

  return (
    <View style={styles.container}>
      <BackHeader title={strings.My_Favorites} />
      <View style={styles?.barber_card_container}>
        {loading ? (
          <FlatList
            data={[1, 2, 3, 4, 5, 6]}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return <UserItemLoader />;
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <>
            {favoriteList?.data?.length > 0 ? (
              <FlatList
                data={favoriteList?.data || []}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshControl}
                    onRefresh={onRefresh}
                  />
                }
                renderItem={({ item, index }) => {
                  return (
                    <FavouriteCard
                      img_url={favoriteList?.user_profile_images_url}
                      data={item}
                      name={item.name}
                      // images={item?.image}
                      rating={item?.averageRating}
                      jobs={item?.jobDone}
                      // location={item?.address}
                      offers={item?.offer?.discount}
                      barberdetailscontinerStyle={
                        styles.barberdetailscontinerStyle
                      }
                      onPress={() => onPressCard(item)}
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
          </>
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
