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
import { hp, wp } from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import { ArrowUp } from "../../theme/SvgIcon";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { PackagesInnerItem } from "..";

type Props = {
  data: any;
};

const MyWorkItem = ({ data }: Props) => {
  const [expanded, setExpanded] = useState(true);

  const onPressArrow = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    setExpanded(!expanded);
  };

  return (
    <View>
      <TouchableOpacity onPress={onPressArrow} style={styles.headerRowStyle}>
        <Text style={styles.titleTextStyle}>{"Hair Cut"}</Text>
        <View style={{ transform: [{ rotate: expanded ? "0deg" : "180deg" }] }}>
          <ArrowUp />
        </View>
      </TouchableOpacity>
      {expanded ? (
        <FlatList
          style={styles.listContainerStyle}
          numColumns={3}
          data={[1, 2, 3, 4, 5, 6, 7, 8]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <View style={styles.itemContainer}>
                <Image
                  resizeMode="cover"
                  style={styles.imgStyle}
                  source={{
                    uri: "https://i.pinimg.com/736x/0a/21/70/0a217095d0a9aa63c28a6adca86c8a82.jpg",
                  }}
                />
              </View>
            );
          }}
        />
      ) : null}
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
    marginTop: hp(30),
  },
  titleTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 20, colors.black),
  },
  itemContainer: {
    marginHorizontal: wp(3),
    height: hp(117),
    width: hp(117),
    marginBottom: hp(6),
    borderRadius: 4,
  },
  listContainerStyle: {
    paddingHorizontal: wp(17),
  },
  imgStyle: {
    height: hp(115),
    borderRadius: 4,
    width: hp(117),
  },
});

export default MyWorkItem;
