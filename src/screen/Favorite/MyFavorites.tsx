import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { BackHeader, Barber_Card } from "../../components";
import { strings } from "../../helper/string";
import { hp, screen_height, wp } from "../../helper/globalFunction";
import { barbers } from "../../helper/constunts";

const MyFavorites = () => {
  return (
    <View style={styles.container}>
      <BackHeader title={strings.My_Favorites} />

      <View style={styles?.barber_card_container}>
        <FlatList
          data={barbers}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            return (
              <Barber_Card
                name={item.name}
                type="Without Service"
                images={item?.image}
                rating={item.rating}
                jobs={item?.jobs_done}
                location={item.address}
                offers={item?.offers}
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
        />
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
});
