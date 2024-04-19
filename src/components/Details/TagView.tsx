import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { images } from "../../theme/icons";
import { hp, wp } from "../../helper/globalFunction";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";
type TagViewProps = {
  Icon?: any;
  title: string;
  onPress: () => void;
  onPressClose: () => void;
  isSelected: boolean;
};

const TagView = ({
  Icon,
  title,
  onPress,
  isSelected,
  onPressClose,
}: TagViewProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      {isSelected ? (
        <ImageBackground
          resizeMode="contain"
          source={images.blue_border_button}
          style={{ ...styles.buttonStyle, justifyContent: "space-between" }}
        >
          <Text style={styles.btnTextStyle}>{title}</Text>
          <TouchableOpacity onPress={onPressClose}>
            <Text style={styles.btnTextStyle}>{"X"}</Text>
          </TouchableOpacity>
        </ImageBackground>
      ) : (
        <ImageBackground
          resizeMode="contain"
          source={images.grey_border_button}
          style={styles.buttonStyle}
        >
          <Text
            style={{
              ...styles.btnTextStyle,
              flex: 1,
              textAlign: !Icon ? "center" : null,
            }}
          >
            {title}
          </Text>
          {Icon}
        </ImageBackground>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    height: hp(40),
    width: wp(110),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(13),
  },
  btnTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 15, colors.black_2),
  },
  headerRowStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: wp(20),
    marginVertical: hp(10),
    alignItems: "center",
    marginTop: -hp(50),
  },
});

export default TagView;
