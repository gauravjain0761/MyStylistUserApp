import {
  ColorValue,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
} from "react-native";
import React, { FC } from "react";
import { hp, wp } from "../../helper/globalFunction";
import { images } from "../../theme/icons";
import { colors } from "../../theme/color";
import LinearGradient from "react-native-linear-gradient";

interface input_props {
  placeholder: string;
  input_style?: TextStyle;
  placeholder_color?: ColorValue | any;
  value?: String | number | any;
  input_container_style?: TextStyle;
  custom_component?: any;
  onTextChange?: any;
  keyboardType?: "phone-pad" | "default";
}

const Login_Input = ({
  placeholder = "Enter Text...",
  input_style,
  placeholder_color = colors?.fc_light_gray,
  value,
  input_container_style,
  custom_component = null,
  onTextChange,
  keyboardType = "phone-pad",
}: input_props) => {
  return (
    <View style={styles?.container}>
      <ImageBackground
        source={images?.gradient_input}
        style={[styles?.def_input_bg, input_container_style]}
        resizeMode="stretch"
      >
        {custom_component || (
          <TextInput
            placeholder={placeholder}
            value={value}
            keyboardType={keyboardType}
            placeholderTextColor={placeholder_color}
            showSoftInputOnFocus
            style={[styles?.def_input_styles, input_style]}
            onChangeText={(e: string) => onTextChange(e)}
          />
        )}
      </ImageBackground>
    </View>
  );
};

export default Login_Input;

const styles = StyleSheet.create({
  container: {},
  def_input_bg: {
    width: wp(280),
    height: hp(55),
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  def_input_styles: {
    width: "100%",
    height: "100%",
  },
  placeholder: {},
});
