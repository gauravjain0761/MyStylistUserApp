import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { stylists_filter } from "../../helper/constunts";
import Filter_Button from "./Filter_Button";
import { wp } from "../../helper/globalFunction";

const FilterHome = () => {
  return (
    <FlatList
      data={stylists_filter}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={({ item, index }: any) => {
        return (
          <Filter_Button
            onPress={() => {}}
            containerStyle={
              stylists_filter.length - 1 == index
                ? { marginRight: wp(10) }
                : null
            }
            title={item?.title}
            type={item?.isIcon == true ? "icon" : "simple"}
          />
        );
      }}
      ItemSeparatorComponent={() => (
        <View style={styles?.filter_item_separator}></View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  filter_item_separator: {
    width: wp(7),
  },
});

export default FilterHome;
