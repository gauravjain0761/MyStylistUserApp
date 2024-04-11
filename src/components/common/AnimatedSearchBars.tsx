import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Animated,
  Easing,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { hp, wp } from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { SearchIcon } from "../../theme/SvgIcon";

const AnimatedSearchTexts = ({
  onPressSearch,
}: {
  onPressSearch: () => void;
}) => {
  const arrays = [
    ["Stylist by Stylist Name"],
    ["Stylist by Pictures"],
    ["Stylist by Services"],
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animate();
  }, [currentIndex]);

  const animate = () => {
    Animated.timing(translateY, {
      toValue: -10,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      translateY.setValue(0);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % arrays.length);
    });
  };

  return (
    <TouchableOpacity onPress={onPressSearch} style={styles.mainContainer}>
      <View style={styles.search_box}>
        <SearchIcon />
        <Animated.Text
          style={[
            styles.text,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          {arrays[currentIndex]}
        </Animated.Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: wp(20),
    paddingVertical: hp(9),
    backgroundColor: colors.background_grey,
  },
  container: {
    borderWidth: 1,
  },
  text: {
    ...commonFontStyle(fontFamily.medium, 14, "#949495"),
    marginLeft: wp(10),
  },
  search_box: {
    width: "100%",
    backgroundColor: colors?.white,
    borderWidth: 1,
    height: hp(41),
    borderColor: colors?.gray_border,
    borderRadius: wp(8),
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: wp(10),
  },
});

export default AnimatedSearchTexts;
