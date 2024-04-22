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
import { useAppSelector } from "../../redux/hooks";
import FastImage from "react-native-fast-image";
import ImageModal from "../common/ImageModal";

type Props = {
  data: any;
  index: number;
};

const MyWorkItem = ({ data, index }: Props) => {
  const [expanded, setExpanded] = useState(true);
  const { itemDetails } = useAppSelector((state) => state.home);

  const onPressArrow = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    setExpanded(!expanded);
  };

  return (
    <View key={index}>
      <TouchableOpacity onPress={onPressArrow} style={styles.headerRowStyle}>
        <Text style={styles.titleTextStyle}>{"My Work"}</Text>
        <View style={{ transform: [{ rotate: expanded ? "0deg" : "180deg" }] }}>
          <ArrowUp />
        </View>
      </TouchableOpacity>
      {expanded ? (
        <FlatList
          style={styles.listContainerStyle}
          numColumns={3}
          data={itemDetails?.user?.user_work_images}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <View key={index} style={styles.itemContainer}>
                <FastImage
                  resizeMode="cover"
                  style={styles.imgStyle}
                  source={{
                    priority: FastImage.priority.high,
                    uri: itemDetails?.featured_image_url + "/" + item.image,
                  }}
                />
              </View>
            );
          }}
        />
      ) : null}
      <ImageModal
        data={itemDetails?.user?.user_work_images}
        baseURL={itemDetails?.featured_image_url}
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
    marginTop: hp(30),
  },
  titleTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 20, colors.black),
  },
  itemContainer: {
    marginHorizontal: wp(3),
    height: screen_width - wp(267),
    width: screen_width - wp(267),
    marginBottom: hp(6),
    borderRadius: 4,
  },
  listContainerStyle: {
    paddingHorizontal: wp(17),
  },
  imgStyle: {
    height: screen_width - wp(267),
    width: screen_width - wp(267),
    borderRadius: 4,
    backgroundColor: colors.grey_19,
  },
});

export default MyWorkItem;
