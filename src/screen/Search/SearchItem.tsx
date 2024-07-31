import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  LayoutAnimation,
  TouchableOpacity,
} from "react-native";
import { RecentItem, SearchBar, SearchImageItem } from "../../components";
import { hp, wp } from "../../helper/globalFunction";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getAllSubServicesSearch, getMainServices } from "../../actions";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "../../helper/routeNames";
import { ArrowUp } from "../../theme/SvgIcon";
import { getAsyncUserInfo } from "../../helper/asyncStorage";

const SearchItem = () => {
  const { navigate } = useNavigation();
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { searchList } = useAppSelector((state) => state.home);
  const [services, setServices] = useState([]);
  const { mainService, itemDetails } = useAppSelector((state) => state.home);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    getMainService();
    getSearch("");
  }, []);

  const getMainService = async () => {
    let obj = {
      onSuccess: () => {},
      onFailure: (Err) => {
        console.log("Errr in Offer", Err);
      },
    };
    dispatch(getMainServices(obj));
  };

  useEffect(() => {
    setServices(mainService);
    let selectedObj = {};
    mainService?.forEach((service) => {
      Object?.assign(selectedObj, { [service?.service_name]: true });
    });
    if (Object?.values(expanded)?.length == 0 && mainService?.length) {
      setExpanded(selectedObj);
    }
  }, [mainService]);

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

  const onPressItem = async (item: any) => {
    // @ts-ignore
    navigate(screenName.YourStylist, {
      id: item?.user_id,
      itemDetails: itemDetails,
    });
  };

  const onPressArrow = (item) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    setExpanded((prevExpandedItems) => ({
      ...prevExpandedItems,
      [item.service_name]: !prevExpandedItems[item.service_name],
    }));
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
          data={services}
          renderItem={({ item: items, index }) => {
            const isExpanded = expanded[items?.service_name];
            const newData = searchList?.subService?.filter(
              (item) => item?.service_name == items?.service_name
            );
            return (
              <>
                <TouchableOpacity
                  onPress={() => onPressArrow(items)}
                  style={styles.headerRowStyle}
                >
                  <Text style={styles.titleTextStyle}>
                    {items?.service_name}
                  </Text>
                  <View
                    style={{
                      transform: [{ rotate: isExpanded ? "0deg" : "180deg" }],
                    }}
                  >
                    <ArrowUp />
                  </View>
                </TouchableOpacity>
                {isExpanded ? (
                  <FlatList
                    data={newData}
                    style={styles.listContainerStyle}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                      return (
                        <FlatList
                          data={item?.fileName}
                          numColumns={3}
                          renderItem={({ item: items, index }) => {
                            return (
                              <SearchImageItem
                                data={items}
                                key={index}
                                onPressItem={() => onPressItem(items)}
                              />
                            );
                          }}
                        />
                      );
                    }}
                  />
                ) : null}
              </>
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
  headerRowStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: hp(10),
    alignItems: "center",
    paddingHorizontal: wp(20),
    marginTop: hp(30),
  },
  titleTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 20, colors.black),
  },
});

export default SearchItem;
