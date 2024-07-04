import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { hp, wp } from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import Modal from "react-native-modal";
import { ModalCloseIcon } from "../../theme/SvgIcon";
import { strings } from "../../helper/string";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type props = {
  visible: boolean;
  transparent?: boolean;
  contain?: any;
  close?: any;
  containStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  isIcon?: boolean;
  IsBackdropPress?: boolean;
  backdropColor?: string;
};

const Modals = ({
  visible = false,
  transparent = true,
  contain,
  close,
  containStyle,
  containerStyle,
  IsBackdropPress = true,
  isIcon,
  backdropColor = "rgba(0, 0, 0, 0.8)",
}: props) => {
  return (
    <Modal
      isVisible={visible}
      animationIn="slideInUp"
      onBackdropPress={() => (IsBackdropPress ? close(false) : close(true))}
      style={[styles.container_style, containerStyle]}
      backdropColor={backdropColor}
    >
      <>
        {isIcon && (
          <TouchableOpacity onPress={() => close(false)}>
            <ModalCloseIcon />
          </TouchableOpacity>
        )}
        <View style={[styles.contain, containStyle]}>
          <KeyboardAwareScrollView style={{ width: "100%" }}>
            {contain}
          </KeyboardAwareScrollView>
        </View>
      </>
    </Modal>
  );
};

export default Modals;

const styles = StyleSheet.create({
  contain: {
    width: "100%",
    backgroundColor: colors.white,
    paddingHorizontal: wp(20),
    paddingVertical: hp(24),
    justifyContent: "center",
    alignItems: "flex-start",
    borderTopLeftRadius: wp(20),
    borderTopRightRadius: wp(20),
    marginTop: hp(10),
    marginBottom: 0,
  },
  container_style: {
    width: "100%",
    alignItems: "center",
    padding: 0,
    margin: 0,
    justifyContent: "flex-end",
  },
});
