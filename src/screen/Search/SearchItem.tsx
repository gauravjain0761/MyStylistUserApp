import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { RecentItem, SearchBar, SearchImageItem } from "../../components";
import { hp, wp } from "../../helper/globalFunction";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";

const SearchItem = () => {
  const [searchText, setSearchText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View style={styles.container}>
      <SearchBar
        value={searchText}
        onChangeText={setSearchText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {!isFocused ? (
        <FlatList
          data={[1, 2, 3, 4]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return <SearchImageItem data={item} key={index} />;
          }}
        />
      ) : (
        <>
          {searchText?.trim()?.length === 0 ? (
            <FlatList
              data={[1, 2, 3]}
              ListHeaderComponent={
                <View style={styles.headerContainer}>
                  <Text style={styles.headerTextStyle}>{"Recent"}</Text>
                </View>
              }
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => {
                return <RecentItem data={item} key={index} />;
              }}
            />
          ) : (
            <FlatList
              data={[1, 2, 3, 5, 7]}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => {
                return <RecentItem data={item} key={index} isHideClose />;
              }}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: wp(20),
    paddingTop: hp(20),
  },
  headerTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black),
  },
});

export default SearchItem;
