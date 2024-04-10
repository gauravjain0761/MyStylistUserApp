import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { RecentItem, SearchBar, SearchImageItem } from "../../components";
import { hp, wp } from "../../helper/globalFunction";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getAllSubServicesSearch } from "../../actions";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "../../helper/routeNames";

const SearchItem = () => {
  const { navigate } = useNavigation();
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { searchList } = useAppSelector((state) => state.home);

  useEffect(() => {
    getSearch("");
  }, []);

  const getSearch = (text: string) => {
    let data = {
      sub_service_name: text,
      limit: 10,
      page: 1,
    };
    let obj = {
      data: data,
      onSuccess: () => {},
      onFailure: () => {},
    };
    dispatch(getAllSubServicesSearch(obj));
  };

  const onChangeText = (text: string) => {
    setSearchText(text);
    getSearch(text);
  };

  const onPressItem = (item: any) => {
    // @ts-ignore
    navigate(screenName.ImageDetails, { item: item });
  };

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchText}
        onChangeText={onChangeText}
        // onFocus={() => setIsFocused(true)}
        // onBlur={() => setIsFocused(true)}
      />
      {!isFocused ? (
        <FlatList
          numColumns={3}
          data={searchList?.subService}
          style={styles.listContainerStyle}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <SearchImageItem
                data={item}
                key={index}
                onPressItem={() => onPressItem(item)}
              />
            );
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
  listContainerStyle: {
    paddingHorizontal: wp(17),
    marginTop: hp(20),
  },
});

export default SearchItem;
