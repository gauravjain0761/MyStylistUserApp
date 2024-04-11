import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { RecentItem, SearchBar } from "../../components";
import { hp, wp } from "../../helper/globalFunction";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getAllUserName } from "../../actions";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "../../helper/routeNames";
import {
  getAsyncSearchUserList,
  setAsyncSearchUserList,
} from "../../helper/asyncStorage";
import { api } from "../../helper/apiConstants";

const SearchStylistName = () => {
  const { navigate } = useNavigation();
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { searchStylistList } = useAppSelector((state) => state.home);
  const [recentUser, setRecentUser] = useState<any>([]);

  useEffect(() => {
    async function getRecentSearchData() {
      let userList = await getAsyncSearchUserList();
      setRecentUser(userList);
    }
    getRecentSearchData();
  }, []);

  const getSearch = (text: string) => {
    let data = {
      name: text,
    };
    let obj = {
      data: data,
      onSuccess: () => {},
      onFailure: () => {},
    };
    dispatch(getAllUserName(obj));
  };

  const onChangeText = (text: string) => {
    setSearchText(text);
    getSearch(text);
  };

  const onPressItem = async (item: any) => {
    let users = await getAsyncSearchUserList();
    setAsyncSearchUserList([...users, item]);
    // @ts-ignore
    navigate(screenName.YourStylist, { id: item?._id });
  };

  const onPressRecentItem = (item: any) => {
    //@ts-ignore
    navigate(screenName.YourStylist, { id: item?._id });
  };

  const onPressCloseItem = async (index: number) => {
    let users = await getAsyncSearchUserList();
    let data = [...users];
    data.splice(index, 1);
    setAsyncSearchUserList(data);
    setRecentUser(data);
  };

  return (
    <View style={styles.container}>
      <SearchBar value={searchText} onChangeText={onChangeText} />
      {searchText?.trim()?.length === 0 ? (
        <FlatList
          data={recentUser}
          ListHeaderComponent={
            <View style={styles.headerContainer}>
              <Text style={styles.headerTextStyle}>{"Recent"}</Text>
            </View>
          }
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <RecentItem
                data={item}
                key={index}
                featured_image_url={api.IMG_URL_2}
                onPressItem={() => onPressRecentItem(item)}
                onPressClose={() => onPressCloseItem(index)}
              />
            );
          }}
        />
      ) : (
        <FlatList
          data={searchStylistList?.users}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <RecentItem
                data={item}
                key={index}
                isHideClose
                featured_image_url={searchStylistList?.featured_image_url}
                onPressItem={() => onPressItem(item)}
              />
            );
          }}
        />
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

export default SearchStylistName;
