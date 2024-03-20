import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  FlatList,
  Image,
} from "react-native";
import { hp, screen_width, wp } from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import { ArrowUp } from "../../theme/SvgIcon";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { PackagesInnerItem } from "..";
import { strings } from "../../helper/string";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "../../helper/routeNames";

type Props = {
  data: any;
};

const SearchImageItem = ({ data }: Props) => {
  const { navigate } = useNavigation();
  const [count, setCount] = useState<any>(6);
  const onPressMore = () => {
    setCount(8);
  };

  const onPressImageItem = () => {
    // @ts-ignore
    navigate(screenName.ImageDetails);
  };

  return (
    <View>
      <View style={styles.headerRowStyle}>
        <View style={styles.rowStyle}>
          <Text style={styles.titleTextStyle}>{"Hair Cut"}</Text>
          <TouchableOpacity>
            <Text style={styles.viewmoreTextStyle}>{"View More"}</Text>
          </TouchableOpacity>
        </View>
        {count === 8 ? null : (
          <TouchableOpacity onPress={onPressMore}>
            <Text style={styles.moreTextStyle}>{strings["View More"]}</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        style={styles.listContainerStyle}
        numColumns={3}
        data={[1, 2, 3, 4, 5, 6, 7, 8].slice(0, count)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={onPressImageItem}
              style={styles.itemContainer}
            >
              <Image
                resizeMode="cover"
                style={styles.imgStyle}
                source={{
                  uri: "https://i.pinimg.com/736x/0a/21/70/0a217095d0a9aa63c28a6adca86c8a82.jpg",
                }}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerRowStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: hp(10),
    alignItems: "center",
    paddingHorizontal: wp(20),
    marginTop: hp(20),
  },
  titleTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 16, colors.black),
    flex: 1,
  },
  itemContainer: {
    marginHorizontal: wp(3),
    height: screen_width - wp(267),
    width: screen_width - wp(267),
    marginBottom: hp(10),
    borderRadius: 4,
  },
  listContainerStyle: {
    paddingHorizontal: wp(17),
  },
  imgStyle: {
    borderRadius: 4,
    height: screen_width - wp(267),
    width: screen_width - wp(267),
  },
  moreTextStyle: {
    ...commonFontStyle(fontFamily.regular, 14, colors.gery_6),
  },
  rowStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  viewmoreTextStyle: {
    ...commonFontStyle(fontFamily.regular, 14, colors.gery_6),
  },
});

export default SearchImageItem;
