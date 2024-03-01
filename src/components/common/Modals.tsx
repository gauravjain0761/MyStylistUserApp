import {
  Modal,
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

type props = {
  visible: boolean;
  transparent?: boolean;
  animation?: "fade" | "slide" | "none";
  contain?: any;
  close?: any;
  containStyle?: ViewStyle;
  containerStyle?: ViewStyle;
};

const Modals = ({
  visible = false,
  transparent = true,
  animation,
  contain,
  close,
  containStyle,
  containerStyle,
}: props) => {
  return (
    <Modal
      visible={visible}
      transparent={transparent}
      animationType={animation}
    >
      <TouchableOpacity
        onPress={() => close(false)}
        style={[styles.modal, containerStyle]}
      ></TouchableOpacity>
      <View style={[styles.contain, containStyle]}>{contain}</View>
    </Modal>
  );
};

export default Modals;

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  contain: {
    position: "absolute",
    width: "100%",
    backgroundColor: colors.white,
    paddingHorizontal: wp(20),
    paddingVertical: hp(24),
    justifyContent: "center",
    alignItems: "flex-start",
    borderTopLeftRadius: wp(20),
    borderTopRightRadius: wp(20),
    bottom: 0,
  },
});
